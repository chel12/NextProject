import { prisma } from '@/prisma/prisma-client';
import { OrderStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

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
	const { items, totalAmount, status } = await req.json();

	const updated = await prisma.order.update({
		where: { id },
		data: {
			items: items,
			totalAmount,
			status,
		},
	});

	return NextResponse.json({ success: true, updated });
}

export async function DELETE(
	_: NextRequest,
	{ params }: { params: { id: string } }
) {
	const id = Number(params.id);
	await prisma.order.delete({ where: { id } });
	return NextResponse.json({ success: true });
}

export async function POST(req: NextRequest) {
	const { items, totalAmount, status, fullName, phone, address, email } =
		await req.json();

	if (
		!Array.isArray(items) ||
		typeof totalAmount !== 'number' ||
		!Object.values(OrderStatus).includes(status) ||
		!fullName ||
		!phone ||
		!address ||
		!email
	) {
		return NextResponse.json({ error: 'Неверные данные' }, { status: 400 });
	}

	const statusEnum = status as OrderStatus;

	const newOrder = await prisma.order.create({
		data: {
			items: JSON.stringify(items),
			totalAmount,
			status: statusEnum,
			fullName,
			phone,
			address,
			email,
			token: crypto.randomUUID(),
		},
	});

	return NextResponse.json({ success: true, newOrder });
}
