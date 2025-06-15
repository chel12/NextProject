'use client';

import { useState } from 'react';
import { Order, OrderStatus, User } from '@prisma/client';

type OrderWithUser = Order & {
	user?: Pick<User, 'id' | 'fullName' | 'email'> | null;
};

type OrderItem = {
	productItemId: number;
	productName: string;
	price: number;
	quantity: number;
	ingredients: {
		id: number;
		name: string;
		price: number;
	}[];
};

export default function OrdersPage() {
	const [orders, setOrders] = useState<OrderWithUser[]>([]);
	const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Функция загрузки заказов
	const fetchOrders = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/orders');

			if (!response.ok) {
				throw new Error('Failed to fetch orders');
			}

			const data = await response.json();
			setOrders(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error');
		} finally {
			setLoading(false);
		}
	};

	// Функция обновления статуса
	const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
		try {
			const response = await fetch(`/api/orders/${orderId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status }),
			});

			if (!response.ok) {
				throw new Error('Failed to update order');
			}

			const updatedOrder = await response.json();
			setOrders((prev) =>
				prev.map((order) =>
					order.id === updatedOrder.id ? updatedOrder : order
				)
			);
		} catch (err) {
			console.error('Update error:', err);
		}
	};

	// Загружаем заказы при монтировании
	useState(() => {
		fetchOrders();
	});

	if (loading) return <div>Loading orders...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8">Order Management</h1>

			<div className="bg-white rounded-lg shadow overflow-hidden">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Order ID
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Customer
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Amount
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Date
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{orders.map((order) => (
							<OrderRow
								key={order.id}
								order={order}
								isExpanded={expandedOrderId === order.id}
								onToggleExpand={() =>
									setExpandedOrderId((prev) =>
										prev === order.id ? null : order.id
									)
								}
								onStatusChange={(status) =>
									updateOrderStatus(order.id, status)
								}
							/>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

// Компонент строки заказа
function OrderRow({
	order,
	isExpanded,
	onToggleExpand,
	onStatusChange,
}: {
	order: OrderWithUser;
	isExpanded: boolean;
	onToggleExpand: () => void;
	onStatusChange: (status: OrderStatus) => void;
}) {
	const orderItems = order.items as unknown as OrderItem[];

	return (
		<>
			<tr
				className={`cursor-pointer hover:bg-gray-50 ${
					isExpanded ? 'bg-blue-50' : ''
				}`}
				onClick={onToggleExpand}>
				<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
					#{order.id}
				</td>
				<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
					<div>{order.user?.fullName || order.fullName}</div>
					<div className="text-gray-400">
						{order.user?.email || order.email}
					</div>
				</td>
				<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
					{order.totalAmount} ₽
				</td>
				<td className="px-6 py-4 whitespace-nowrap">
					<StatusSelect
						value={order.status}
						onChange={onStatusChange}
					/>
				</td>
				<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
					{new Date(order.createdAt).toLocaleDateString()}
				</td>
				<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
					<button
						className="text-blue-600 hover:text-blue-900"
						onClick={onToggleExpand}>
						{isExpanded ? 'Hide' : 'Show'} Details
					</button>
				</td>
			</tr>

			{isExpanded && (
				<tr>
					<td colSpan={6} className="px-6 py-4 bg-gray-50">
						<OrderDetails order={order} items={orderItems} />
					</td>
				</tr>
			)}
		</>
	);
}

// Компонент выбора статуса
function StatusSelect({
	value,
	onChange,
}: {
	value: OrderStatus;
	onChange: (status: OrderStatus) => void;
}) {
	return (
		<select
			value={value}
			onChange={(e) => onChange(e.target.value as OrderStatus)}
			className={`px-2 py-1 rounded text-xs font-semibold ${
				value === 'PENDING'
					? 'bg-yellow-100 text-yellow-800'
					: value === 'SUCCEEDED'
					? 'bg-green-100 text-green-800'
					: 'bg-red-100 text-red-800'
			}`}
			onClick={(e) => e.stopPropagation()}>
			{Object.values(OrderStatus).map((status) => (
				<option key={status} value={status}>
					{status}
				</option>
			))}
		</select>
	);
}

// Компонент деталей заказа
function OrderDetails({
	order,
	items,
}: {
	order: OrderWithUser;
	items: OrderItem[];
}) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<h3 className="text-lg font-medium mb-4">Order Items</h3>
				<div className="space-y-4">
					{items.map((item, index) => (
						<div key={index} className="border-b pb-4">
							<div className="flex justify-between">
								<h4 className="font-medium">
									{item.productName}
								</h4>
								<span>
									{item.price} ₽ × {item.quantity}
								</span>
							</div>

							{item.ingredients.length > 0 && (
								<div className="mt-2 pl-4">
									<h5 className="text-sm font-medium text-gray-600">
										Ingredients:
									</h5>
									<ul className="list-disc pl-5">
										{item.ingredients.map((ing) => (
											<li
												key={ing.id}
												className="text-sm">
												{ing.name} (+{ing.price} ₽)
											</li>
										))}
									</ul>
								</div>
							)}

							<div className="mt-2 text-right font-medium">
								Total:{' '}
								{(item.price +
									item.ingredients.reduce(
										(sum, ing) => sum + ing.price,
										0
									)) *
									item.quantity}{' '}
								₽
							</div>
						</div>
					))}
				</div>
			</div>

			<div>
				<h3 className="text-lg font-medium mb-4">
					Customer Information
				</h3>
				<div className="bg-gray-50 rounded-lg p-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="text-sm text-gray-600">Full Name</p>
							<p className="font-medium">{order.fullName}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">Email</p>
							<p className="font-medium">{order.email}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">Phone</p>
							<p className="font-medium">{order.phone}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">Address</p>
							<p className="font-medium">{order.address}</p>
						</div>
					</div>

					{order.comment && (
						<div className="mt-4">
							<p className="text-sm text-gray-600">Comment</p>
							<p className="font-medium">{order.comment}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
