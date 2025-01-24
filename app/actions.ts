'use server';

import { prisma } from '@/prisma/prisma-client';
import { CheckoutFormValues } from '@/shared/constants';
import { OrderStatus } from '@prisma/client';
import { cookies } from 'next/headers';

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
		//TODO:Сделать создание ссылки оплату
		return 'link';
	} catch (error) {}
	
}
