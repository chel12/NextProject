import { prisma } from '@/prisma/prisma-client';
import { AdminOrdersPanel } from '@/shared/components/shared/admin-orders-panel';
import { getUserSession } from '@/shared/lib/get-user-session';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import { Container } from '@/shared/components';

export default async function AdminOrdersPage({
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

	if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
		return redirect('/not-auth');
	}

	// Получаем номер страницы из параметров
	const currentPage = Number(searchParams.page) || 1;
	const itemsPerPage = 10;
	const offset = (currentPage - 1) * itemsPerPage;

	// Получаем общее количество заказов
	const totalOrders = await prisma.order.count();

	// Получаем заказы с информацией о пользователях с пагинацией
	const orders = await prisma.order.findMany({
		skip: offset,
		take: itemsPerPage,
		orderBy: { createdAt: 'desc' },
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

	// Вычисляем общее количество страниц
	const totalPages = Math.ceil(totalOrders / itemsPerPage);

	return (
		<Container className="my-10">
			<h1 className="text-3xl font-bold text-center mt-14">
				Заказы пользователей
			</h1>
			<AdminOrdersPanel
				isAdmin={user.role === 'ADMIN'}
				isManager={user.role === 'MANAGER'}
				orders={ordersWithParsedItems}
				currentPage={currentPage}
				totalPages={totalPages}
			/>
		</Container>
	);
}
