import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const ingredients = await prisma.ingredient.findMany({
			orderBy: { name: 'asc' },
		});
		return NextResponse.json(ingredients);
	} catch (error) {
		console.error('Ошибка получения ингредиентов:', error);
		return NextResponse.json(
			{ error: 'Ошибка сервера при загрузке ингредиентов' },
			{ status: 500 }
		);
	}
}
