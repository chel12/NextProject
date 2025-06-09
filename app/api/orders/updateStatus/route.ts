import { NextRequest, NextResponse } from 'next/server';

import { OrderStatus } from '@prisma/client';
import { prisma } from '@/prisma/prisma-client';

export async function PATCH(request: NextRequest) {
	try {
		// Парсим тело запроса
		const body = await request.json();
		const { orderId, status } = body;

		// Валидация данных
		if (!orderId || typeof orderId !== 'number') {
			return NextResponse.json(
				{ error: 'Invalid order ID' },
				{ status: 400 }
			);
		}

		if (!status || !Object.values(OrderStatus).includes(status)) {
			return NextResponse.json(
				{ error: 'Invalid status value' },
				{ status: 400 }
			);
		}

		// Обновление заказа в базе данных
		const updatedOrder = await prisma.order.update({
			where: { id: orderId },
			data: { status },
		});

		return NextResponse.json(updatedOrder);
	} catch (error) {
		console.error('Error updating order:', error);

		return NextResponse.json(
			{
				error: 'Internal server error',
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}

// Добавляем обработчик OPTIONS для CORS
export async function OPTIONS() {
	return new Response(null, {
		status: 204,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		},
	});
}
