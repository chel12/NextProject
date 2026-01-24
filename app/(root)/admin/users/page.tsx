import { prisma } from '@/prisma/prisma-client';
import { AdminUsersPanel } from '@/shared/components/shared/admin-users-panel';
import { getUserSession } from '@/shared/lib/get-user-session';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import { Container } from '@/shared/components';

export default async function AdminUsersPage({
	searchParams,
}: {
	searchParams: { page?: string };
}) {
	noStore(); // Отключаем кэширование

	const session = await getUserSession();

	if (!session) {
		return redirect('/not-auth');
	}

	// Проверяем, является ли пользователь администратором
	const user = await prisma.user.findFirst({
		where: { id: Number(session?.id) },
	});

	if (!user || user.role !== 'ADMIN') {
		return redirect('/not-auth');
	}

	// Получаем номер страницы из параметров
	const currentPage = Number(searchParams.page) || 1;
	const itemsPerPage = 10;
	const offset = (currentPage - 1) * itemsPerPage;

	// Получаем общее количество пользователей
	const totalUsers = await prisma.user.count();

	// Получаем пользователей с пагинацией
	const users = await prisma.user.findMany({
		skip: offset,
		take: itemsPerPage,
		orderBy: { createdAt: 'desc' },
		select: {
			id: true,
			fullName: true,
			email: true,
			role: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	// Вычисляем общее количество страниц
	const totalPages = Math.ceil(totalUsers / itemsPerPage);

	return (
		<Container className="container my-10">
			<h1 className="text-3xl font-bold text-center mt-14">
				Пользователи системы
			</h1>
			<AdminUsersPanel
				isAdmin={true}
				isManager={false}
				users={users}
				currentPage={currentPage}
				totalPages={totalPages}
			/>
		</Container>
	);
}
