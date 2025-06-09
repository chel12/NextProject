'use client';
import React, { useState, useEffect } from 'react';
import { OrderStatus } from '@prisma/client';

// Сохраняем оригинальные интерфейсы
interface OrderItem {
	id: number;
	status: OrderStatus;
	totalAmount: number;
	fullName: string;
	createdAt: Date | string;
	email: string;
	items: any;
}

interface OrderDetails {
	id: number;
	name: string;
	imageUrl: string;
	quantity: number;
	price: number;
	ingredients: {
		id: number;
		name: string;
		price: number;
	}[];
}

interface Props {
	className?: string;
	orders: OrderItem[];
}

export const OrderList: React.FC<Props> = ({ className, orders }) => {
	const [localOrders, setLocalOrders] = useState<OrderItem[]>(orders);
	const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
	const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([]);
	const [isUpdating, setIsUpdating] = useState<Record<number, boolean>>({});

	// Синхронизация с пропсами с защитой от сброса при оптимистичном обновлении
	useEffect(() => {
		// Обновляем только если количество заказов изменилось
		if (orders.length !== localOrders.length) {
			setLocalOrders(orders);
		} else {
			// Сохраняем локальные статусы при обновлении данных
			const updatedOrders = orders.map((order) => {
				const localOrder = localOrders.find((o) => o.id === order.id);
				return localOrder && localOrder.status !== order.status
					? { ...order, status: localOrder.status }
					: order;
			});
			setLocalOrders(updatedOrders);
		}
	}, [orders]);

	const getStatusText = (status: OrderStatus) => {
		switch (status) {
			case 'PENDING':
				return 'В обработке';
			case 'SUCCEEDED':
				return 'Выполнен';
			case 'CANCELLED':
				return 'Отменен';
			default:
				return status;
		}
	};

	const getStatusColor = (status: OrderStatus) => {
		switch (status) {
			case 'PENDING':
				return 'bg-yellow-100 text-yellow-800';
			case 'SUCCEEDED':
				return 'bg-green-100 text-green-800';
			case 'CANCELLED':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const handleStatusChange = async (
		orderId: number,
		newStatus: OrderStatus
	) => {
		const order = localOrders.find((o) => o.id === orderId);
		if (!order) return;

		const originalStatus = order.status;

		// Оптимистичное обновление UI
		setLocalOrders((prev) =>
			prev.map((order) =>
				order.id === orderId ? { ...order, status: newStatus } : order
			)
		);

		setIsUpdating((prev) => ({ ...prev, [orderId]: true }));

		try {
			const response = await fetch('/api/orders/updateStatus', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					orderId,
					status: newStatus,
				}),
			});

			// Детальная обработка ошибок
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					`HTTP error! status: ${response.status}, message: ${errorData.error}`
				);
			}

			const updatedOrder = await response.json();
			console.log('Order updated successfully:', updatedOrder);
		} catch (error) {
			console.error('Update failed:', error);
			// Откат при ошибке
			setLocalOrders((prev) =>
				prev.map((order) =>
					order.id === orderId
						? { ...order, status: originalStatus }
						: order
				)
			);

			// Показываем пользователю сообщение об ошибке
			alert(
				`Не удалось обновить статус: ${
					error instanceof Error
						? error.message
						: 'Неизвестная ошибка'
				}`
			);
		} finally {
			setIsUpdating((prev) => {
				const newState = { ...prev };
				delete newState[orderId];
				return newState;
			});
		}
	};

	const handleOrderClick = async (orderId: number, itemsData: any) => {
		if (selectedOrder === orderId) {
			setSelectedOrder(null);
			return;
		}

		try {
			// Улучшенная обработка данных
			const items =
				typeof itemsData === 'string'
					? JSON.parse(itemsData)
					: itemsData;

			const details = items.map((item: any) => ({
				id: item.productItemId || item.id,
				name: item.productItem?.product?.name || item.name,
				imageUrl:
					item.productItem?.product?.imageUrl ||
					item.imageUrl ||
					'/placeholder.jpg',
				quantity: item.quantity,
				price: item.priceAtOrder || item.price || 0,
				ingredients:
					item.ingredients?.map((ing: any) => ({
						id: ing.id,
						name: ing.name,
						price: ing.price || 0,
					})) || [],
			}));

			setOrderDetails(details);
			setSelectedOrder(orderId);
		} catch (error) {
			console.error('Ошибка при обработке данных заказа:', error);
			setOrderDetails([]);
			setSelectedOrder(orderId);
		}
	};

	return (
		<div className={`${className} overflow-x-auto`}>
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							ID
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Клиент
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Дата
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Сумма
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Статус
						</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{localOrders.map((order) => (
						<React.Fragment key={order.id}>
							<tr
								onClick={() =>
									handleOrderClick(order.id, order.items)
								}
								className={`cursor-pointer hover:bg-gray-50 ${
									selectedOrder === order.id
										? 'bg-blue-50'
										: ''
								}`}>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									#{order.id}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{order.fullName}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{new Date(
										order.createdAt
									).toLocaleDateString()}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{order.totalAmount} руб.
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center space-x-2">
										<select
											value={order.status}
											onChange={(e) =>
												handleStatusChange(
													order.id,
													e.target
														.value as OrderStatus
												)
											}
											disabled={isUpdating[order.id]}
											onClick={(e) => e.stopPropagation()}
											className={`min-w-[120px] px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
												order.status
											)} ${
												isUpdating[order.id]
													? 'opacity-50 cursor-not-allowed'
													: 'cursor-pointer'
											} focus:ring-1 focus:ring-blue-500`}>
											<option value="PENDING">
												В обработке
											</option>
											<option value="SUCCEEDED">
												Выполнен
											</option>
											<option value="CANCELLED">
												Отменен
											</option>
										</select>

										{isUpdating[order.id] && (
											<svg
												className="animate-spin h-4 w-4 text-gray-500"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24">
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
										)}
									</div>
								</td>
							</tr>

							{selectedOrder === order.id && (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-4 bg-gray-50">
										<div className="border-t border-gray-200 pt-4">
											<h3 className="text-lg font-medium text-gray-900 mb-3">
												Состав заказа #{order.id}
											</h3>

											{orderDetails.length > 0 ? (
												<div className="space-y-4">
													{orderDetails.map(
														(item) => (
															<div
																key={item.id}
																className="border-b pb-3 last:border-0">
																<div className="flex items-center">
																	<img
																		src={
																			item.imageUrl
																		}
																		alt={
																			item.name
																		}
																		className="w-16 h-16 object-cover rounded mr-4"
																		onError={(
																			e
																		) => {
																			(
																				e.target as HTMLImageElement
																			).src =
																				'/placeholder.jpg';
																		}}
																	/>

																	<div className="flex-1">
																		<h4 className="font-medium text-gray-900 mb-1">
																			{
																				item.name
																			}
																		</h4>

																		<div className="flex justify-between">
																			<span>
																				Количество:{' '}
																				{
																					item.quantity
																				}{' '}
																				шт.
																			</span>
																			<span>
																				{
																					item.price
																				}{' '}
																				руб.
																				×{' '}
																				{
																					item.quantity
																				}{' '}
																				шт.
																			</span>
																		</div>

																		{item
																			.ingredients
																			.length >
																			0 && (
																			<div className="mt-2 pl-4 text-sm text-gray-600">
																				<p className="font-medium">
																					Дополнительно:
																				</p>
																				<ul className="list-disc pl-5">
																					{item.ingredients.map(
																						(
																							ingredient
																						) => (
																							<li
																								key={
																									ingredient.id
																								}>
																								{
																									ingredient.name
																								}{' '}
																								(+
																								{
																									ingredient.price
																								}{' '}
																								руб.)
																							</li>
																						)
																					)}
																				</ul>
																			</div>
																		)}
																	</div>
																</div>
															</div>
														)
													)}

													<div className="mt-4 pt-4 border-t border-gray-200 flex justify-between font-bold">
														<span>Итого:</span>
														<span>
															{order.totalAmount}{' '}
															руб.
														</span>
													</div>
												</div>
											) : (
												<p className="text-gray-500">
													Не удалось загрузить детали
													заказа
												</p>
											)}
										</div>
									</td>
								</tr>
							)}
						</React.Fragment>
					))}
				</tbody>
			</table>
		</div>
	);
};
