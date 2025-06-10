import { Container, InfoBlock, Title } from '@/shared/components';
import React from 'react';
import { OrderList } from '@/shared/components/shared/orders/order-list';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/shared/constants/auth-options';
import ProductManager from '@/shared/components/shared/product-manager';

const session = await getServerSession(authOptions);

export default function AdminPanel() {
	return (
		<Container className="mt-8">
			<Title
				className=" font-extrabold mb-8 text-[36px]"
				text="Управление сайтом"
			/>

			{session?.user.role === 'ADMIN' ? (
				<ProductManager />
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
