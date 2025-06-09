'use client';
import React, { useState } from 'react';
import { OrderStatus } from '@prisma/client';

interface OrderItem {
	id: number;
	status: OrderStatus;
	totalAmount: number;
	fullName: string;
	createdAt: Date | string;
	email: string;
	items: any; // JSON-данные о товарах
}

interface OrderDetails {
	id: number;
	name: string;
	imageUrl: string; // Добавлено поле для изображения
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
	const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
	const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([]);
	console.log(orders);
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

	const handleOrderClick = async (orderId: number, itemsData: any) => {
		if (selectedOrder === orderId) {
			setSelectedOrder(null);
			return;
		}

		try {
			const items = JSON.parse(itemsData);
			console.log(items);
			const details = items.map((item: any) => ({
				id: item.productItemId,
				name: item.productItem.product.name,
				imageUrl: item.productItem.product.imageUrl, // Добавлено изображение
				quantity: item.quantity,
				price: item.priceAtOrder || item.price,
				ingredients: item.ingredients.map((ing: any) => ({
					id: ing.id,
					name: ing.name,
					price: ing.price,
				})),
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
					{orders.map((order) => (
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
									<span
										className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
											order.status
										)}`}>
										{getStatusText(order.status)}
									</span>
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
																	{/* Добавлено изображение товара */}
																	<img
																		src={
																			item.imageUrl
																		}
																		alt={
																			item.name
																		}
																		className="w-16 h-16 object-cover rounded mr-4"
																	/>

																	<div className="flex-1">
																		{/* Добавлено название товара */}
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
																				}
																				руб.
																				×
																				{
																					item.quantity
																				}
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
