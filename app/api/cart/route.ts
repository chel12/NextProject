import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { findOrCreateCart } from '@/shared/lib/find-or-create-cart';
import { CreateCartItemValues } from '@/services/dto/cart.dto';
import { updateCartTotalAmount } from '@/shared/lib';

export async function GET(req: NextRequest) {
	try {
		//заглушка токена
		const token = req.cookies.get('cartToken')?.value;
		//запрос получения корзины по токену
		if (!token) {
			return NextResponse.json({ totalAmount: 0, cart: [] });
		}

		const userCart = await prisma.cart.findFirst({
			/*вернуть первую корзину, у которой есть такой пользователь
или токен */

			where: {
				OR: [{ token }],
			},
			include: {
				//все товары из корзины
				items: {
					orderBy: {
						//отсортируй по новым
						createdAt: 'desc',
					},
					//вместе с items верни продукт и ингредиенты
					include: {
						productItem: {
							include: {
								product: true,
							},
						},
						ingredients: true,
					},
				},
			},
		});

		return NextResponse.json(userCart);
	} catch (error) {
		console.log('[CART_GET] Server error', error);
		return NextResponse.json(
			{ message: 'Не удалось получить корзину' },
			{ status: 500 }
		);
	}
}
export async function POST(req: NextRequest) {
	try {
		let token = req.cookies.get('cartToken')?.value;

		if (!token) {
			token = crypto.randomUUID();
		}

		//создать или получить корзину
		const userCart = await findOrCreateCart(token);
		//что сервер должен получить от клиента
		const data = (await req.json()) as CreateCartItemValues;
		//чтобы не добавлять новую, проверяем вариацию и если совпадает увеличить count
		const findCartItem = await prisma.cartItem.findFirst({
			where: {
				cartId: userCart.id,
				productItemId: data.productItemId,
				//каждый ингредиент найти и связать его с карт айтемом
				ingredients: {
					every: {
						id: { in: data.ingredients },
					},
				},
			},
		});
		//если товар найден + 1
		if (findCartItem) {
			await prisma.cartItem.update({
				where: {
					id: findCartItem.id,
				},
				data: {
					quantity: findCartItem.quantity + 1,
				},
			});
		} else {
			// товар не найден
			await prisma.cartItem.create({
				data: {
					cartId: userCart.id,
					productItemId: data.productItemId,
					quantity: 1,
					ingredients: {
						connect: data.ingredients?.map((id) => ({
							id,
						})),
					},
				},
			});
		}

		const updatedUserCart = await updateCartTotalAmount(token);
		const resp = NextResponse.json(updatedUserCart);
		resp.cookies.set('cartToken', token);
		return resp;
	} catch (error) {
		console.log('[CART_POST] Server error', error);
		return NextResponse.json(
			{ message: 'Не удалось создать корзину' },
			{ status: 500 }
		);
	}
}
