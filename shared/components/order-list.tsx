'use client';

import { Order, User, OrderStatus } from '@prisma/client';
import { useEffect, useState } from 'react';
import { ScrollArea } from './ui/scroll-area';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from './ui/accordion';
import { Badge } from './ui/badge';
import { Button, Select } from '.';
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';

type OrderWithUser = Order & { user: User | null };

const statusColors: Record<OrderStatus, string> = {
	PENDING: 'bg-yellow-200 text-yellow-900',
	SUCCEEDED: 'bg-green-200 text-green-900',
	CANCELLED: 'bg-red-200 text-red-900',
};

export const OrderList = () => {
	const [orders, setOrders] = useState<OrderWithUser[]>([]);

	useEffect(() => {
		// Фетч заказов с сервера
		const fetchOrders = async () => {
			const res = await fetch('/api/admin/orders');
			const data = await res.json();
			setOrders(data);
		};
		fetchOrders();
	}, []);

	const handleStatusChange = async (id: number, status: OrderStatus) => {
		await fetch(`/api/admin/orders/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status }),
		});

		setOrders((prev) =>
			prev.map((o) => (o.id === id ? { ...o, status } : o))
		);
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Удалить заказ?')) return;
		await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
		setOrders((prev) => prev.filter((o) => o.id !== id));
	};

	return (
		<ScrollArea className="h-[80vh] p-4 border rounded-lg">
			<Accordion type="multiple">
				{orders.map((order) => (
					<AccordionItem key={order.id} value={String(order.id)}>
						<div className="flex justify-between items-center gap-4 py-2">
							<AccordionTrigger className="flex-1 text-left">
								<div className="flex flex-col">
									<span className="font-medium">
										{order.fullName}
									</span>
									<span className="text-sm text-muted-foreground">
										{order.email}
									</span>
								</div>
							</AccordionTrigger>

							<Badge className={statusColors[order.status]}>
								{order.status}
							</Badge>

							<Select
								value={order.status}
								onValueChange={(value) =>
									handleStatusChange(
										order.id,
										value as OrderStatus
									)
								}>
								<SelectTrigger className="w-[140px]">
									<SelectValue placeholder="Статус" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="PENDING">
										PENDING
									</SelectItem>
									<SelectItem value="SUCCEEDED">
										SUCCEEDED
									</SelectItem>
									<SelectItem value="CANCELLED">
										CANCELLED
									</SelectItem>
								</SelectContent>
							</Select>

							<Button
								variant="destructive"
								onClick={() => handleDelete(order.id)}>
								Удалить
							</Button>
						</div>

						<AccordionContent className="text-sm text-muted-foreground bg-gray-50 p-4 rounded-md mt-2">
							<p>
								<strong>Телефон:</strong> {order.phone}
							</p>
							<p>
								<strong>Адрес:</strong> {order.address}
							</p>
							<p>
								<strong>Комментарий:</strong>{' '}
								{order.comment || '—'}
							</p>
							<p>
								<strong>Сумма:</strong> {order.totalAmount} ₽
							</p>
							<p className="mt-2 font-medium">Состав:</p>
							<pre className="bg-muted rounded p-2 text-xs whitespace-pre-wrap">
								{JSON.stringify(order.items, null, 2)}
							</pre>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</ScrollArea>
	);
};
