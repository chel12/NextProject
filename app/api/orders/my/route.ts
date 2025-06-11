import { getServerSession } from 'next-auth';
import { authOptions } from '@/shared/constants/auth-options';
import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session?.user?.id) {
		return NextResponse.json([], { status: 401 });
	}

	const userId = Number(session.user.id);
	if (isNaN(userId)) {
		return NextResponse.json([], {
			status: 400,
			statusText: 'Invalid user ID',
		});
	}

	const orders = await prisma.order.findMany({
		where: { userId },
		orderBy: { createdAt: 'desc' },
		include: {
			user: {
				select: {
					fullName: true,
					email: true,
				},
			},
		},
	});

	const ordersWithDetails = await Promise.all(
		orders.map(async (order) => {
			let itemsParsed: Array<{
				id: number;
				quantity: number;
				productItem?: { id: number };
				ingredients: { id: number }[];
			}> = [];

			try {
				itemsParsed = JSON.parse(order.items as string);
			} catch {
				itemsParsed = [];
			}

			const detailedItems = await Promise.all(
				itemsParsed.map(async (item) => {
					if (!item.productItem?.id) {
						return {
							...item,
							productItem: null,
							ingredients: [],
						};
					}

					const productItemWithProduct =
						await prisma.productItem.findUnique({
							where: { id: item.productItem.id },
							select: {
								id: true,
								price: true,
								product: {
									select: {
										name: true,
										imageUrl: true,
									},
								},
							},
						});

					const ingredients = await Promise.all(
						(item.ingredients || []).map((ing) =>
							prisma.ingredient.findUnique({
								where: { id: ing.id },
								select: {
									id: true,
									name: true,
									ImageUrl: true,
									price: true,
								},
							})
						)
					);

					return {
						...item,
						productItem: productItemWithProduct ?? null,
						ingredients: ingredients.filter(Boolean),
					};
				})
			);

			return {
				...order,
				items: detailedItems,
				userName: order.user?.fullName ?? order.fullName,
				userEmail: order.user?.email ?? order.email,
			};
		})
	);

	return NextResponse.json(ordersWithDetails);
}
