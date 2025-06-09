import React from 'react';
import { OrderStatus } from '@prisma/client';

interface OrderItem {
	id: number;
	status: OrderStatus;
	totalAmount: number;
	fullName: string;
	createdAt: Date | string;
	email: string;
}

interface Props {
	className?: string;
	orders: OrderItem[];
}

export const OrderList: React.FC<Props> = ({ className, orders }) => {
	// Функция для перевода статуса
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

	// Функция для цвета статуса
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
							Email
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
						<tr key={order.id}>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								#{order.id}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
								{order.fullName}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{order.email}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{new Date(order.createdAt).toLocaleDateString()}
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
					))}
				</tbody>
			</table>
		</div>
	);
};
