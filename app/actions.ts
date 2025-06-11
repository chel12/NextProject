'use server';

import { prisma } from '@/prisma/prisma-client';
import { PayOrderTemplate, VerificationUser } from '@/shared/components';
import { CheckoutFormValues } from '@/shared/constants';
import { authOptions } from '@/shared/constants/auth-options';
import { createPayments, sendEmail } from '@/shared/lib';
import { getUserSession } from '@/shared/lib/get-user-session';
import { OrderStatus, Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';

export async function createOrder(data: CheckoutFormValues) {
	try {
		const cookieStore = cookies();
		const cartToken = cookieStore.get('cartToken')?.value;

		if (!cartToken) {
			throw new Error('Cart token not found');
		}

		// Получаем сессию пользователя
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			throw new Error('User not authenticated');
		}

		// userId из сессии (у тебя в сессии user.id может быть string, приводим к number)
		const userId = session.user.id ? Number(session.user.id) : null;

		// Находим корзину по токену
		const userCart = await prisma.cart.findFirst({
			where: { token: cartToken },
			include: {
				items: {
					include: {
						ingredients: true,
						productItem: {
							include: {
								product: true,
							},
						},
					},
				},
			},
		});

		if (!userCart) {
			throw new Error('Cart not found');
		}

		if (userCart.totalAmount === 0) {
			throw new Error('Cart is empty');
		}

		// Создаем заказ, передаем userId из сессии, а не из корзины
		const order = await prisma.order.create({
			data: {
				userId, // <--- здесь явно userId из сессии
				token: cartToken,
				fullName: data.firstName + ' ' + data.lastName,
				email: data.email,
				phone: data.phone,
				address: data.address,
				comment: data.comment,
				totalAmount: userCart.totalAmount,
				status: OrderStatus.PENDING,
				items: JSON.stringify(userCart.items),
			},
		});

		// Очищаем корзину
		await prisma.cart.update({
			where: { id: userCart.id },
			data: { totalAmount: 0 },
		});

		await prisma.cartItem.deleteMany({
			where: { cartId: userCart.id },
		});

		const paymentData = await createPayments({
			amount: order.totalAmount,
			orderId: order.id,
			description: 'Оплата заказа #' + order.id,
		});

		if (!paymentData) {
			throw new Error('Payment data not found');
		}

		await prisma.order.update({
			where: { id: order.id },
			data: {
				paymendId: paymentData.id,
			},
		});

		const paymentUrl = paymentData.confirmation.confirmation_url;

		await sendEmail(
			data.email,
			'Next Pizza / Оплатите заказ #' + order.id,
			PayOrderTemplate({
				orderId: order.id,
				totalAmount: order.totalAmount,
				paymentUrl,
			})
		);

		return paymentUrl;
	} catch (err) {
		console.log('[CreateOrder] Server error', err);
		throw err;
	}
}

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
	try {
		const currentUser = await getUserSession();

		if (!currentUser) {
			throw new Error('Пользователь не найден');
		}

		const findUser = await prisma.user.findFirst({
			where: {
				id: Number(currentUser.id),
			},
		});

		await prisma.user.update({
			where: {
				id: Number(currentUser.id),
			},
			data: {
				fullName: body.fullName,
				email: body.email,
				password: body.password
					? hashSync(body.password as string, 10)
					: findUser?.password,
			},
		});
	} catch (err) {
		console.log('Error [UPDATE_USER]', err);
		throw err;
	}
}

export async function registerUser(body: Prisma.UserCreateInput) {
	try {
		const user = await prisma.user.findFirst({
			where: {
				email: body.email,
			},
		});

		if (user) {
			if (!user.verified) {
				throw new Error('Почта не подтверждена');
			}

			throw new Error('Пользователь уже существует');
		}

		const createdUser = await prisma.user.create({
			data: {
				fullName: body.fullName,
				email: body.email,
				password: hashSync(body.password, 10),
			},
		});

		const code = Math.floor(100000 + Math.random() * 900000).toString();

		await prisma.verificationCode.create({
			data: {
				code,
				userId: createdUser.id,
			},
		});

		await sendEmail(
			createdUser.email,
			'Next Pizza / 📝 Подтверждение регистрации',
			VerificationUser({
				code,
			})
		);
	} catch (err) {
		console.log('Error [CREATE_USER]', err);
		throw err;
	}
}
export async function getUserOrders() {
	const session = await getUserSession();

	if (!session?.id) {
		throw new Error('User not authenticated');
	}

	const orders = await prisma.order.findMany({
		where: {
			userId: Number(session.id),
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	return orders;
}
