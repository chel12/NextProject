import { prisma } from '@/prisma/prisma-client';
import { authOptions } from '../constants/auth-options';
import { getServerSession } from 'next-auth';

export const findOrCreateCart = async (token: string) => {
	const session = await getServerSession(authOptions);
	const userId: number | null = session?.user?.id
		? parseInt(session.user.id, 10)
		: null;

	let userCart = await prisma.cart.findFirst({
		where: { token },
	});

	if (!userCart) {
		userCart = await prisma.cart.create({
			data: {
				token,
				userId,
			},
		});
	}

	return userCart;
};
