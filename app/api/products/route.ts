import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const data = await request.json();

		// Валидация данных
		if (!data.name || !data.imageUrl || !data.categoryName || !data.items) {
			return NextResponse.json(
				{ error: 'Не все обязательные поля заполнены' },
				{ status: 400 }
			);
		}

		// Находим ID категории по имени
		const category = await prisma.category.findUnique({
			where: { name: data.categoryName },
		});

		if (!category) {
			return NextResponse.json(
				{ error: `Категория "${data.categoryName}" не найдена` },
				{ status: 404 }
			);
		}

		// Создаем продукт
		const product = await prisma.product.create({
			data: {
				name: data.name,
				imageUrl: data.imageUrl,
				categoryId: category.id,
				items: {
					create: data.items.map((item: any) => ({
						price: item.price,
						platformType: item.platformType || null,
						gameType: item.gameType || null,
					})),
				},
			},
			include: { items: true },
		});

		return NextResponse.json(product);
	} catch (error: any) {
		console.error('Ошибка создания продукта:', error);
		return NextResponse.json(
			{ error: error.message || 'Внутренняя ошибка сервера' },
			{ status: 500 }
		);
	}
}
