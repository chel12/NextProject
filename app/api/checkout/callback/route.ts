//запрос для юкассы, статус заказа

import { PaymentCallbackData } from '@/@types/yookassa';
import { prisma } from '@/prisma/prisma-client';
import { CartItemDTO } from '@/services/dto/cart.dto';
import { OrderStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		//принял запрос
		const body = (await req.json()) as PaymentCallbackData;
		//определяем чей и что дальше
		const order = await prisma.order.findFirst({
			where: {
				id: Number(body.object.metadata.order_id),
			},
		});

		//если нет заказа выдай ошибку
		if (!order) {
			return NextResponse.json(
				{ error: 'Order not found' },
				{ status: 404 }
			);
		}
		//обновляем статус оплаты заказа в БД
		await prisma.order.update({
			where: {
				id: order.id,
			},
			data: {
				status: OrderStatus.SUCCEEDED,
			},
		});

		//вытаскиваем items

		const items = order?.items as unknown as CartItemDTO[];
	} catch (error) {
		console.log('[Checkout Callback] Error:', error);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
