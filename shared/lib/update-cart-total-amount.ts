import { prisma } from '@/prisma/prisma-client';
import { calcCartItemTotalPrice } from './calc-cart-item-total-price';

//фукнция обновления кол-во корзины через призму
export const updateCartTotalAmount = async (token: string) => {
	//поиск карточки юзера по токену
	const userCart = await prisma.cart.findFirst({
		where: {
			token,
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

	if (!userCart) {
		return;
	}
	//калькуляция стоимости всех товаров в корзине
	const totalAmount = userCart?.items.reduce((acc, item) => {
		return acc + calcCartItemTotalPrice(item);
	}, 0);
	//обновить корзину по токену
	return await prisma.cart.update({
		where: {
			id: userCart.id,
		},
		data: {
			totalAmount,
		},
		//и после обновы верни связи
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
};
