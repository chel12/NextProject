'use client';

import { Container, Title } from '@/shared/components';
import React from 'react';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
	const { data: session } = useSession();

	return (
		<Container className="mt-8">
			<Title
				className=" font-extrabold mb-8 text-[36px]"
				text="Управление заказами"
			/>
			{session?.user?.role === 'MANAGER' ? (
				<>
					<div>Менеджер</div>
				</>
			) : (
				<>
					<div>Нет Прав</div>
				</>
			)}
		</Container>
	);
}


