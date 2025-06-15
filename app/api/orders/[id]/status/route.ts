import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const orderId = Number(params.id);
		if (isNaN(orderId)) {
			return NextResponse.json(
				{ error: 'Invalid order id' },
				{ status: 400 }
			);
		}

		const body = await req.json();
		const { status } = body;

		const validStatuses = ['PENDING', 'SUCCEEDED', 'CANCELLED'];
		if (!validStatuses.includes(status)) {
			return NextResponse.json(
				{ error: 'Invalid status' },
				{ status: 400 }
			);
		}

		const updatedOrder = await prisma.order.update({
			where: { id: orderId },
			data: { status },
		});

		return NextResponse.json(updatedOrder);
	} catch (error) {
		console.error('Ошибка в PUT /api/orders/[id]/status:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
