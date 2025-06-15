import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { items } = body;

		if (!items || !Array.isArray(items)) {
			return NextResponse.json(
				{ error: 'Items must be an array' },
				{ status: 400 }
			);
		}

		const productItemIds = items
			.map((item: any) => item.productItemId)
			.filter(Boolean);

		if (productItemIds.length === 0) {
			return NextResponse.json(
				{ error: 'No productItemIds found' },
				{ status: 400 }
			);
		}

		const productItems = await prisma.productItem.findMany({
			where: { id: { in: productItemIds } },
			include: {
				product: {
					select: {
						name: true,
						imageUrl: true,
					},
				},
			},
		});

		let orderTotal = 0;

		const detailedItems = productItems.map((pi) => {
			const match = items.find(
				(item: any) => item.productItemId === pi.id
			);
			const quantity = match?.quantity || 1;
			const total = quantity * pi.price;
			orderTotal += total;

			return {
				id: pi.id,
				quantity,
				total,
				product: {
					name: pi.product.name,
					imageUrl: pi.product.imageUrl,
					price: pi.price,
				},
			};
		});

		return NextResponse.json({ items: detailedItems, orderTotal });
	} catch (error) {
		console.error('Ошибка в POST /api/order-products:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
