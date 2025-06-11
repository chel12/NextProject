// app/api/orders/[id]/route.ts
import { prisma } from '@/prisma/prisma-client';
import { OrderStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
const OrderItemSchema = z.object({
	productItemId: z.number(),
	quantity: z.number().min(1),
	ingredients: z.array(z.number()),
});

const OrderUpdateSchema = z.object({
	fullName: z.string().min(1),
	email: z.string().email(),
	phone: z.string().min(1),
	address: z.string().min(1),
	totalAmount: z.number(),
	status: z.enum(['PENDING', 'SUCCEEDED', 'CANCELLED']),
	items: z.array(OrderItemSchema),
});
export async function GET(req: NextRequest) {
	const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
	const take = 5;
	const skip = (page - 1) * take;

	const [orders, total] = await Promise.all([
		prisma.order.findMany({
			skip,
			take,
			orderBy: { createdAt: 'desc' },
			include: {
				user: { select: { fullName: true, email: true } },
			},
		}),
		prisma.order.count(),
	]);

	return NextResponse.json({
		orders: orders.map((o) => ({
			...o,
			items: JSON.parse(o.items as any),
		})),
		total,
	});
}
export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const id = Number(params.id);

	let body;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json(
			{ error: 'Некорректный JSON' },
			{ status: 400 }
		);
	}

	const parseResult = OrderUpdateSchema.safeParse(body);

	if (!parseResult.success) {
		return NextResponse.json(
			{ error: 'Ошибка валидации', details: parseResult.error.flatten() },
			{ status: 400 }
		);
	}

	const { fullName, email, phone, address, totalAmount, status, items } =
		parseResult.data;

	try {
		const updated = await prisma.order.update({
			where: { id },
			data: {
				fullName,
				email,
				phone,
				address,
				totalAmount,
				status,
				items: JSON.stringify(items),
			},
		});

		return NextResponse.json({ success: true, updated });
	} catch (err) {
		console.error('Ошибка обновления заказа:', err);
		return NextResponse.json(
			{ error: 'Ошибка при обновлении заказа' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	_: NextRequest,
	{ params }: { params: { id: string } }
) {
	const id = Number(params.id);
	await prisma.order.delete({ where: { id } });
	return NextResponse.json({ success: true });
}
