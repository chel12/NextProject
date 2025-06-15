import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const orders = await prisma.order.findMany({
			select: {
				id: true,
				status: true,
				items: true,
				fullName: true,
				email: true,
				phone: true,
				address: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return NextResponse.json(orders);
	} catch (error) {
		console.error('Ошибка при получении заказов:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
