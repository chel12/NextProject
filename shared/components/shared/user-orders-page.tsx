'use client';

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
							<div className="border-t pt-4">
								<table className="w-full border-collapse border border-gray-300 text-left">
									<thead>
										<tr>
											<th className="border border-gray-300 p-2">
												Изображение
											</th>
											<th className="border border-gray-300 p-2">
												Название
											</th>
											<th className="border border-gray-300 p-2">
												Цена за шт.
											</th>
											<th className="border border-gray-300 p-2">
												Количество
											</th>
											<th className="border border-gray-300 p-2">
												Ингредиенты
											</th>
											<th className="border border-gray-300 p-2">
												Цена ингредиентов
											</th>
										</tr>
									</thead>
									<tbody>
										{order.items.map((item) => {
											const product =
												item.productItem?.product;
											const productPrice =
												item.productItem?.price ?? 0;
											const totalIngredientsPrice =
												item.ingredients.reduce(
													(sum, ing) =>
														sum + (ing.price ?? 0),
													0
												);

											return (
												<tr
													key={item.id}
													className="border border-gray-300">
													<td className="border border-gray-300 p-2">
														{product?.imageUrl ? (
															<img
																src={
																	product.imageUrl
																}
																alt={
																	product.name
																}
																width={60}
																height={60}
																className="rounded object-cover"
															/>
														) : (
															'—'
														)}
													</td>
													<td className="border border-gray-300 p-2">
														{product?.name ??
															'Неизвестный продукт'}
													</td>
													<td className="border border-gray-300 p-2">
														{productPrice} ₽
													</td>
													<td className="border border-gray-300 p-2">
														{item.quantity}
													</td>
													<td className="border border-gray-300 p-2">
														{item.ingredients
															.length > 0 ? (
															<ul>
																{item.ingredients.map(
																	(ing) => (
																		<li
																			key={
																				ing.id
																			}
																			className="flex items-center space-x-2">
																			{ing.ImageUrl ? (
																				<img
																					src={
																						ing.ImageUrl
																					}
																					alt={
																						ing.name
																					}
																					width={
																						30
																					}
																					height={
																						30
																					}
																					className="rounded object-cover"
																				/>
																			) : (
																				<span>
																					—
																				</span>
																			)}
																			<span>
																				{
																					ing.name
																				}
																			</span>
																		</li>
																	)
																)}
															</ul>
														) : (
															'Без ингредиентов'
														)}
													</td>
													<td className="border border-gray-300 p-2">
														{totalIngredientsPrice}{' '}
														₽
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
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
