
import { Container, InfoBlock, Title } from '@/shared/components';
import React from 'react';
import { useSession } from 'next-auth/react';
import { OrderList } from '@/shared/components/shared/orders/order-list';
import { prisma } from '@/prisma/prisma-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/shared/constants/auth-options';

const orders = await prisma.order.findMany({
	select: {
	  id: true,
	  status: true,
	  totalAmount: true,
	  fullName: true,
	  email: true,
	  createdAt: true,
	},
	orderBy: {
	  createdAt: 'desc',
	},
	take: 50, // Ограничение количества заказов
 });
 const session = await getServerSession(authOptions);
 
 export default function DashboardPage() {
	 return (
		<Container className="mt-8">
			<Title
				className=" font-extrabold mb-8 text-[36px]"
				text="Управление заказами"
			/>
			{session?.user.role === 'MANAGER' ||
			session?.user.role === 'ADMIN' ? (
				<OrderList orders={orders}></OrderList>
			) : (
				<div className="flex flex-col items-center justify-center mt-40">
					<InfoBlock
						title="Доступ запрещен"
						text="Данную страницу могут просматривать только авторизованные пользователи"
						imageUrl="/assets/images/lock.png"
					/>
				</div>
			)}
		</Container>
	);
}
