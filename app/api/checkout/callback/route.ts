//запрос для юкассы, статус заказа
import { PaymentCallbackData } from '@/@types/yookassa';
import { prisma } from '@/prisma/prisma-client';
import { CartItemDTO } from '@/services/dto/cart.dto';
import { OrderSuccessTemplate } from '@/shared/components/shared/email-templates/order-success';
import { sendEmail } from '@/shared/lib';
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

		const isSucceeded = body.object.status === 'succeeded';
		await prisma.order.update({
			where: {
				id: order.id,
			},
			data: {
				status: isSucceeded
					? OrderStatus.SUCCEEDED
					: OrderStatus.CANCELLED,
			},
		});

		//вытаскиваем items
		const items = JSON.parse(
			order?.items as unknown as string
		) as CartItemDTO[];
		if (isSucceeded) {
			await sendEmail(
				order.email,
				'Next Game / Заказ успешно оплачен 🥰',
				OrderSuccessTemplate({ orderId: order.id, items })
			);
		} else {
			//письмо об отмене заказа
		}
	} catch (error) {
		console.log('[Checkout Callback] Error:', error);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
