import { prisma } from '@/prisma/prisma-client';
import { getUserSession } from './get-user-session';

//функция проверяет есть ли
export const findOrCreateCart = async (token: string) => {
	const session = await getUserSession();

	// Сначала ищем корзину по токену или по userId (если пользователь авторизован)
	let userCart = await prisma.cart.findFirst({
		where: session?.id
			? {
					OR: [{ token }, { userId: Number(session.id) }],
				}
			: {
					token,
				},
	});

	if (!userCart) {
		userCart = await prisma.cart.create({
			data: {
				token,
				userId: session?.id ? Number(session.id) : undefined,
			},
		});
	} else if (session?.id && !userCart.userId) {
		// Если нашли корзину по токену, но пользователь авторизован — привязываем
		userCart = await prisma.cart.update({
			where: { id: userCart.id },
			data: { userId: Number(session.id) },
		});
	}

	return userCart;
};
