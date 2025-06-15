'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { Button } from '.';
import { Collapsible } from './ui/collapsible';

// Для уведомлений добавим простейшую имплементацию toast
function showToast(message: string, type: 'success' | 'error' = 'success') {
	const id = Math.random().toString(36);
	const toast = document.createElement('div');
	toast.id = id;
	toast.textContent = message;
	toast.className = `fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow text-white ${
		type === 'success' ? 'bg-green-600' : 'bg-red-600'
	}`;
	document.body.appendChild(toast);
	setTimeout(() => {
		document.body.removeChild(toast);
	}, 3000);
}

type Order = {
	id: number;
	status: 'PENDING' | 'SUCCEEDED' | 'CANCELLED';
	items: any;
	fullName: string;
	email: string;
	phone: string;
	address: string;
};

type ProductItemWithDetails = {
	id: number;
	quantity: number;
	total: number;
	product: {
		name: string;
		imageUrl: string;
		price: number;
	};
};

type OrderDetails = {
	items: ProductItemWithDetails[];
	orderTotal: number;
};

const statuses = ['PENDING', 'SUCCEEDED', 'CANCELLED'] as const;

export default function OrdersList() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [openOrderId, setOpenOrderId] = useState<number | null>(null);
	const [orderProducts, setOrderProducts] = useState<
		Record<number, OrderDetails>
	>({});
	const [loadingStatus, setLoadingStatus] = useState<Record<number, boolean>>(
		{}
	);

	useEffect(() => {
		fetch('/api/orders')
			.then((res) => res.json())
			.then(setOrders);
	}, []);

	const fetchOrderProducts = async (order: Order) => {
		if (openOrderId === order.id) {
			setOpenOrderId(null);
			return;
		}

		const parsedItems =
			typeof order.items === 'string'
				? JSON.parse(order.items)
				: order.items;

		const res = await fetch('/api/order-products', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ items: parsedItems }),
		});

		if (!res.ok) {
			const error = await res.json();
			alert('Ошибка: ' + (error.error || 'Неизвестная ошибка'));
			return;
		}

		const data: OrderDetails = await res.json();

		setOrderProducts((prev) => ({ ...prev, [order.id]: data }));
		setOpenOrderId(order.id);
	};

	const updateOrderStatus = async (
		orderId: number,
		newStatus: (typeof statuses)[number]
	) => {
		setLoadingStatus((prev) => ({ ...prev, [orderId]: true }));

		const res = await fetch(`/api/orders/${orderId}/status`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status: newStatus }),
		});

		setLoadingStatus((prev) => ({ ...prev, [orderId]: false }));

		if (!res.ok) {
			const error = await res.json();
			showToast(
				'Ошибка обновления статуса: ' +
					(error.error || 'Неизвестная ошибка'),
				'error'
			);
			return;
		}

		setOrders((prev) =>
			prev.map((order) =>
				order.id === orderId ? { ...order, status: newStatus } : order
			)
		);
		showToast('Статус заказа обновлен', 'success');
	};

	const cancelOrder = (orderId: number) => {
		if (confirm('Вы уверены, что хотите отменить заказ?')) {
			updateOrderStatus(orderId, 'CANCELLED');
		}
	};

	const statusColors = {
		PENDING: 'text-yellow-600',
		SUCCEEDED: 'text-green-600',
		CANCELLED: 'text-red-600',
	};

	return (
		<div className="max-w-3xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-6">Список заказов</h1>
			<ul className="space-y-4">
				{orders.map((order) => (
					<li
						key={order.id}
						className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
						onClick={() => fetchOrderProducts(order)}>
						<div className="flex justify-between items-center mb-2">
							<div>
								<span className="font-semibold">
									Заказ #{order.id}
								</span>{' '}
								<span
									className={cn(
										'ml-4 font-semibold',
										statusColors[order.status]
									)}>
									{order.status}
								</span>
							</div>
							<Button
								size="sm"
								variant="outline"
								onClick={(e) => {
									e.stopPropagation();
									fetchOrderProducts(order);
								}}
								disabled={loadingStatus[order.id]}>
								{openOrderId === order.id
									? 'Скрыть'
									: 'Показать'}
							</Button>
						</div>

						{/* Информация о покупателе */}
						<div className="mb-4 text-sm text-gray-700 space-y-1">
							<div>
								<strong>Имя:</strong> {order.fullName}
							</div>
							<div>
								<strong>Email:</strong> {order.email}
							</div>
							<div>
								<strong>Телефон:</strong> {order.phone}
							</div>
							<div>
								<strong>Адрес:</strong> {order.address}
							</div>
						</div>

						{/* Select для изменения статуса */}
						<div className="flex items-center space-x-4 mb-2">
							<label
								htmlFor={`status-select-${order.id}`}
								className="font-semibold">
								Статус:
							</label>
							<select
								id={`status-select-${order.id}`}
								value={order.status}
								onChange={(e) =>
									updateOrderStatus(
										order.id,
										e.target.value as any
									)
								}
								onClick={(e) => e.stopPropagation()}
								disabled={loadingStatus[order.id]}
								className="border rounded p-1">
								{statuses.map((status) => (
									<option key={status} value={status}>
										{status}
									</option>
								))}
							</select>

							<Button
								size="sm"
								variant="destructive"
								onClick={(e) => {
									e.stopPropagation();
									cancelOrder(order.id);
								}}
								disabled={loadingStatus[order.id]}>
								Отменить заказ
							</Button>

							{loadingStatus[order.id] && (
								<span className="ml-2 text-gray-500">
									Обновление...
								</span>
							)}
						</div>

						<Collapsible open={openOrderId === order.id}>
							<ul className="mt-4 space-y-3">
								{orderProducts[order.id]?.items?.map((pi) => (
									<li
										key={pi.id}
										className="flex items-center justify-between border p-2 rounded">
										<div className="flex items-center space-x-4">
											<img
												src={pi.product.imageUrl}
												alt={pi.product.name}
												className="w-12 h-12 rounded object-cover"
											/>
											<div>
												<div className="font-semibold">
													{pi.product.name}
												</div>
												<div className="text-sm text-gray-600">
													Цена: {pi.product.price}₽ ×{' '}
													{pi.quantity}
												</div>
											</div>
										</div>
										<div className="font-semibold">
											{pi.total}₽
										</div>
									</li>
								))}
							</ul>

							{orderProducts[order.id]?.items?.length > 0 && (
								<div className="mt-4 text-right font-bold text-lg">
									Итого: {orderProducts[order.id].orderTotal}₽
								</div>
							)}

							{orderProducts[order.id]?.items?.length === 0 && (
								<p className="text-gray-500 mt-2">
									Продукты не найдены
								</p>
							)}
						</Collapsible>
					</li>
				))}
			</ul>
		</div>
	);
}
