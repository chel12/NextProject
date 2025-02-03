'use server';

import { prisma } from '@/prisma/prisma-client';
import { PayOrderTemplate } from '@/shared/components';
import { CheckoutFormValues } from '@/shared/constants';
import { createPayments, sendEmail } from '@/shared/lib';
import { getUserSession } from '@/shared/lib/get-user-session';
import { OrderStatus, Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { cookies } from 'next/headers';

//серверный экшен для заказа
export async function createOrder(data: CheckoutFormValues) {
	try {
		const cookieStore = cookies();
		const cartToken = cookieStore.get('cartToken')?.value;
		if (!cartToken) {
			throw new Error('Cart token not found');
		}
		/*Находим корзину по токену*/
		const userCart = await prisma.cart.findFirst({
			include: {
				user: true,
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
			where: {
				token: cartToken,
			},
		});
		/*Если корзина не найдена возвращаем ошибку*/
		if (!userCart) {
			throw new Error('Cart not found');
		}
		/* Если корзина пуста возвращаем ошибку*/
		if (userCart?.totalAmount === 0) {
			throw new Error('Cart is empty');
		}
		/*Создаём заказ*/
		const order = await prisma.order.create({
			data: {
				token: cartToken,
				fullName: data.firstName + ' ' + data.lastName,
				email: data.email,
				phone: data.phone,
				address: data.address,
				comment: data.comment,
				status: OrderStatus.PENDING,
				totalAmount: userCart.totalAmount,
				items: JSON.stringify(userCart.items),
			},
		});
		//очистка корзины
		await prisma.cart.update({
			//найди
			where: {
				id: userCart.id,
			},
			//очисть
			data: {
				totalAmount: 0,
			},
		});

		//удалить товары из корзины
		await prisma.cartItem.deleteMany({
			where: {
				cartId: userCart.id,
			},
		});

		/* создание платежа на юкассе*/
		const paymentData = await createPayments({
			amount: order.totalAmount,
			orderId: order.id,
			description: 'Оплата заказа #' + order.id,
		});

		/* ошибка если нет платежа*/
		if (!paymentData) {
			throw new Error('Payment data not found');
		}

		/* обновляем заказ*/
		await prisma.order.update({
			where: {
				id: order.id,
			},
			//paymentId id юкассы оплат, индификатор платежа
			data: {
				paymendId: paymentData.id,
			},
		});

		//*RESEND БИБЛИОТЕКА для теста отправки писем
		/* ссылка перенаправления на оплату*/
		const paymentUrl = paymentData.confirmation.confirmation_url;
		/* отправка */
		await sendEmail(
			data.email,
			'Next game / Оплатите заказ #' + order.id,
			PayOrderTemplate({
				orderId: order.id,
				totalAmount: order.totalAmount,
				paymentUrl,
			})
		);

		return paymentUrl;
	} catch (error) {
		console.log('[CreateOrder] Server error', error);
	}
}

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
	try {
		//проверка авторизации
		const currenyUser = await getUserSession();

		if (!currenyUser) {
			throw new Error('Пользователь не найден');
		}

		const findUser = await prisma.user.findFirst({
			where: {
				id: Number(currenyUser.id),
			},
		});

		await prisma.user.update({
			where: {
				id: Number(currenyUser.id),
			},
			data: {
				fullName: body.fullName,
				email: body.email,
				password: body.password
					? hashSync(body.password as string, 10)
					: findUser?.password,
			},
		});
	} catch (error) {
		console.log('Error [UPDATE_USER]', error);
		throw error;
	}
}
