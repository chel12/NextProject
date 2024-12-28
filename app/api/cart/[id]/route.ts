import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const id = Number(params.id);
		const body = await req.json();
		const token = req.cookies.get('cartToken')?.value;
		if (!token) {
			return NextResponse.json({ error: 'Cart token not found' });
		}
		const cartItem = await prisma.cartItem.findFirst({
			where: {
				id,
			},
		});
		if (!cartItem) {
			return NextResponse.json({ error: 'Cart item not found' });
		}
	} catch (error) {
		console.log('[CART_PATCH] Server error', error);
		return NextResponse.json(
			{ message: 'Не удалось обновить корзину' },
			{ status: 500 }
		);
	} finally {
	}
}
