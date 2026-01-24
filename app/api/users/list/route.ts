import { prisma } from '@/prisma/prisma-client';
import { getUserSession } from '@/shared/lib/get-user-session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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
				{
					error: 'Недостаточно прав для просмотра списка пользователей',
				},
				{ status: 403 },
			);
		}

		// Получаем всех пользователей с ограниченной информацией
		const users = await prisma.user.findMany({
			select: {
				id: true,
				fullName: true,
				email: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return NextResponse.json({ users }, { status: 200 });
	} catch (error) {
		console.error('Error fetching users list:', error);
		return NextResponse.json(
			{ error: 'Ошибка получения списка пользователей' },
			{ status: 500 },
		);
	}
}
