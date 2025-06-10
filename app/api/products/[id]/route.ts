import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const productId = parseInt(params.id);

	try {
		// Получаем все ProductItem для продукта
		const productItems = await prisma.productItem.findMany({
			where: { productId },
			select: { id: true },
		});
		const productItemIds = productItems.map((item) => item.id);

		// Удаляем CartItem, связанные с ProductItem
		if (productItemIds.length > 0) {
			await prisma.cartItem.deleteMany({
				where: {
					productItemId: { in: productItemIds },
				},
			});
		}

		// Удаляем ProductItem, связанные с продуктом
		await prisma.productItem.deleteMany({
			where: {
				productId,
			},
		});

		// Отключаем связи продукта с ингредиентами (many-to-many)
		await prisma.$executeRaw`
		 DELETE FROM "_IngredientToProduct" WHERE "B" = ${productId}
	  `;
		// Примечание: название таблицы связи в prisma может отличаться, проверь точное имя через prisma studio или в базе

		// Удаляем продукт
		const deletedProduct = await prisma.product.delete({
			where: { id: productId },
		});

		return NextResponse.json(deletedProduct);
	} catch (error) {
		console.error('Error deleting product:', error);
		return NextResponse.json(
			{ error: 'Failed to delete product' },
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
