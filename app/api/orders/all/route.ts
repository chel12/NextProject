import { prisma } from '@/prisma/prisma-client';
import { getUserSession } from '@/shared/lib/get-user-session';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const currentUser = await getUserSession();

		if (!currentUser) {
			return NextResponse.json(
				{ error: 'Пользователь не авторизован' },
				{ status: 401 },
			);
		}

		// Проверяем, является ли пользователь администратором
		const user = await prisma.user.findUnique({
			where: { id: Number(currentUser.id) },
		});

		if (user?.role !== 'ADMIN') {
			return NextResponse.json(
				{ error: 'Недостаточно прав для просмотра заказов' },
				{ status: 403 },
			);
		}

		// Получаем все заказы с информацией о пользователях
		const orders = await prisma.order.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				user: {
					select: {
						id: true,
						fullName: true,
						email: true,
					},
				},
			},
		});

		// Парсим items из JSON строк в объекты
		const ordersWithParsedItems = orders.map((order) => ({
			...order,
			items:
				typeof order.items === 'string'
					? JSON.parse(order.items)
					: order.items,
		}));

		return NextResponse.json(
			{ orders: ordersWithParsedItems },
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error fetching all orders:', error);
		return NextResponse.json(
			{ error: 'Ошибка получения заказов' },
			{ status: 500 },
		);
	}
}
