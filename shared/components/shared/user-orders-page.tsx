'use client';

import Image from 'next/image';
import { Order, OrderStatus } from '@prisma/client';
import { useEffect, useState } from 'react';
import { Api } from '@/services/api-client';

import { OrderItemDTO } from '@/@types/order';
import { Card } from '../ui/card';
import { Button } from '..';

type OrderWithItems = Order & {
	items: OrderItemDTO[];
	userName?: string | null;
	userEmail?: string | null;
};

export default function UserOrdersPage() {
	const [orders, setOrders] = useState<OrderWithItems[]>([]);
	const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

	useEffect(() => {
		async function fetchOrders() {
			try {
				const res = await Api.order.getMyOrders();
				setOrders(res);
			} catch (error) {
				console.error('Ошибка при загрузке заказов', error);
			}
		}

		fetchOrders();
	}, []);

	const toggleExpand = (orderId: number) => {
		setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
	};

	if (!orders.length) {
		return <p className="text-center mt-10">У вас пока нет заказов.</p>;
	}

	return (
		<div className="max-w-4xl mx-auto py-10 space-y-6">
			{orders.map((order) => {
				const isExpanded = expandedOrderId === order.id;

				return (
					<Card key={order.id} className="p-6 space-y-4">
						<div className="flex justify-between items-center">
							<div>
								<p className="text-lg font-semibold">
									Заказ #{order.id}
								</p>
								<p className="text-sm text-muted-foreground">
									Статус:{' '}
									<span
										className={getStatusColor(
											order.status
										)}>
										{order.status}
									</span>
								</p>
								<p className="text-sm text-muted-foreground">
									Сумма: {order.totalAmount} ₽
								</p>
								<p className="text-sm text-muted-foreground">
									Имя: {order.userName ?? 'Неизвестно'}
								</p>
								<p className="text-sm text-muted-foreground">
									Почта: {order.userEmail ?? 'Неизвестна'}
								</p>
							</div>
							<Button
								onClick={() => toggleExpand(order.id)}
								variant="outline">
								{isExpanded ? 'Скрыть' : 'Детали'}
							</Button>
						</div>

						{isExpanded && (
							<div className="border-t pt-4 space-y-4">
								{order.items.map((item) => (
									<div
										key={item.id}
										className="flex items-center border p-3 rounded space-x-4">
										<Image
											src={
												item.productItem?.product
													?.imageUrl ||
												'/no-image.png'
											}
											alt={
												item.productItem?.product
													?.name || 'Продукт'
											}
											width={80}
											height={80}
											className="rounded-lg object-cover"
										/>
										<div>
											<p className="font-medium">
												{item.productItem?.product
													?.name ||
													'Неизвестный продукт'}{' '}
												× {item.quantity}
											</p>
											{item.ingredients.length > 0 && (
												<p className="text-sm text-muted-foreground">
													Ингредиенты:{' '}
													{item.ingredients
														.map((i) => i.name)
														.join(', ')}
												</p>
											)}
										</div>
									</div>
								))}
							</div>
						)}
					</Card>
				);
			})}
		</div>
	);
}

function getStatusColor(status: OrderStatus) {
	switch (status) {
		case 'PENDING':
			return 'text-yellow-500';
		case 'SUCCEEDED':
			return 'text-green-600';
		case 'CANCELLED':
			return 'text-red-500';
		default:
			return '';
	}
}
