import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const search = searchParams.get('search') || '';
		const page = parseInt(searchParams.get('page') || '1');
		const pageSize = parseInt(searchParams.get('pageSize') || '10');

		const skip = (page - 1) * pageSize;

		// Поиск и пагинация
		const [products, totalItems] = await Promise.all([
			prisma.product.findMany({
				where: {
					name: { contains: search, mode: 'insensitive' },
				},
				include: {
					category: true,
					items: true,
					ingredients: true,
				},
				skip,
				take: pageSize,
				orderBy: { id: 'desc' },
			}),
			prisma.product.count({
				where: {
					name: { contains: search, mode: 'insensitive' },
				},
			}),
		]);

		const totalPages = Math.ceil(totalItems / pageSize);

		return NextResponse.json({
			products,
			currentPage: page,
			totalPages,
			pageSize,
			totalItems,
		});
	} catch (error: any) {
		console.error('Ошибка получения продуктов:', error);
		return NextResponse.json(
			{ error: error.message || 'Внутренняя ошибка сервера' },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const data = await request.json();

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
				ingredients: {
					connect: data.ingredients.map((id: number) => ({ id })),
				},
			},
			include: {
				items: true,
				ingredients: true,
			},
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

export async function PUT(request: Request) {
	try {
		const data = await request.json();

		if (
			!data.id ||
			!data.name ||
			!data.imageUrl ||
			!data.categoryName ||
			!data.items
		) {
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

		// Обновляем продукт
		await prisma.$transaction([
			// Удаляем существующие варианты
			prisma.productItem.deleteMany({
				where: { productId: data.id },
			}),

			// Обновляем сам продукт
			prisma.product.update({
				where: { id: data.id },
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
					ingredients: {
						set: data.ingredients.map((id: number) => ({ id })),
					},
				},
			}),
		]);

		return NextResponse.json({ success: true });
	} catch (error: any) {
		console.error('Ошибка обновления продукта:', error);
		return NextResponse.json(
			{ error: error.message || 'Внутренняя ошибка сервера' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const id = parseInt(params.id);

	if (!id) {
		return NextResponse.json(
			{ error: 'ID продукта не указан' },
			{ status: 400 }
		);
	}

	try {
		await prisma.product.delete({
			where: { id },
		});

		return NextResponse.json({ success: true });
	} catch (error: any) {
		console.error('Ошибка удаления продукта:', error);
		return NextResponse.json(
			{ error: error.message || 'Внутренняя ошибка сервера' },
			{ status: 500 }
		);
	}
}
