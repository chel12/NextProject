import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

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
		console.log(error);
	}
}
