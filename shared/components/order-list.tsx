// Обновлённый компонент OrderList.tsx с поддержкой удаления, чекбоксов, цветных статусов, изображений и суммы

'use client';

import { useEffect, useState } from 'react';

import { Order, ProductItem, Ingredient, Product } from '@prisma/client';
import { OrderItemDTO } from '@/@types/order';
import { Card, CardContent } from './ui/card';
import { Button, Input, Select } from '.';
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';

interface FullProductItem extends ProductItem {
	product: Product;
}

interface OrderWithRelations extends Omit<Order, 'items'> {
	items: OrderItemDTO[];
	user: { fullName: string; email: string } | null;
}

const statusColors = {
	PENDING: 'bg-yellow-100 text-yellow-800',
	SUCCEEDED: 'bg-green-100 text-green-800',
	CANCELLED: 'bg-red-100 text-red-800',
};

export default function OrderList() {
	const [orders, setOrders] = useState<OrderWithRelations[]>([]);
	const [availableItems, setAvailableItems] = useState<FullProductItem[]>([]);
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		const fetchData = async () => {
			const ordersRes = await fetch(`/api/orders?page=${page}`);
			const data = await ordersRes.json();
			setOrders(data.orders);
			setTotalPages(Math.ceil(data.total / 5));

			const itemsRes = await fetch('/api/product-items');
			const items = await itemsRes.json();
			setAvailableItems(items);

			const ingRes = await fetch('/api/ingredients');
			const ings = await ingRes.json();
			setIngredients(ings);
		};
		fetchData();
	}, [page]);

	const handleChangeItem = (
		orderId: number,
		itemIndex: number,
		field: 'productItemId' | 'quantity' | 'ingredients',
		value: any
	) => {
		setOrders((prev) =>
			prev.map((order) =>
				order.id === orderId
					? {
							...order,
							items: order.items.map((item, idx) =>
								idx === itemIndex
									? {
											...item,
											quantity:
												field === 'quantity'
													? Number(value)
													: item.quantity,
											productItem:
												field === 'productItemId'
													? availableItems.find(
															(pi) =>
																pi.id ===
																Number(value)
													  )!
													: item.productItem,
											ingredients:
												field === 'ingredients'
													? ingredients.filter(
															(ing) =>
																value.includes(
																	String(
																		ing.id
																	)
																)
													  )
													: item.ingredients,
									  }
									: item
							),
					  }
					: order
			)
		);
	};

	const handleSave = async (order: OrderWithRelations) => {
		const res = await fetch(`/api/orders/${order.id}`, {
			method: 'PUT',
			body: JSON.stringify({
				items: order.items,
				totalAmount: order.items.reduce(
					(sum, i) =>
						sum +
						i.productItem.price * i.quantity +
						i.ingredients.reduce((s, ing) => s + ing.price, 0),
					0
				),
				status: order.status,
			}),
		});
		if (res.ok) alert('Сохранено!');
		else alert('Ошибка!');
	};

	const handleDelete = async (orderId: number) => {
		if (!confirm('Удалить заказ?')) return;
		const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
		if (res.ok) setOrders(orders.filter((o) => o.id !== orderId));
	};

	return (
		<div className="space-y-6">
			{orders.map((order) => (
				<Card key={order.id}>
					<CardContent className="p-4 space-y-3">
						<div className="flex justify-between items-center">
							<div>
								<p>
									<b>ID:</b> {order.id}
								</p>
								<p>
									<b>Покупатель:</b> {order.fullName} (
									{order.email})
								</p>
								<p>
									<b>Адрес:</b> {order.address}
								</p>
							</div>
							<div
								className={`px-2 py-1 rounded ${
									statusColors[order.status]
								}`}>
								{order.status}
							</div>
						</div>

						<div className="space-y-2">
							<p className="font-semibold">Состав:</p>
							{order.items.map((item, index) => (
								<div
									key={index}
									className="p-3 border rounded-md space-y-2">
									<div className="flex items-center gap-3">
										<img
											src={
												item.productItem.product
													.imageUrl
											}
											className="w-12 h-12 object-cover rounded"
										/>
										<Select
											value={String(item.productItem.id)}
											onValueChange={(val) =>
												handleChangeItem(
													order.id,
													index,
													'productItemId',
													val
												)
											}>
											<SelectTrigger>
												<SelectValue placeholder="Продукт" />
											</SelectTrigger>
											<SelectContent>
												{availableItems.map((pi) => (
													<SelectItem
														key={pi.id}
														value={String(pi.id)}>
														<div className="flex items-center gap-2">
															<img
																src={
																	pi.product
																		.imageUrl
																}
																className="w-6 h-6 object-cover"
															/>
															{pi.product.name} (
															{pi.price}₽)
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<Input
										type="number"
										value={item.quantity}
										onChange={(e) =>
											handleChangeItem(
												order.id,
												index,
												'quantity',
												e.target.value
											)
										}
									/>

									<div className="flex flex-wrap gap-2">
										{ingredients.map((ing) => (
											<label
												key={ing.id}
												className="flex items-center gap-1">
												<input
													type="checkbox"
													checked={item.ingredients.some(
														(i) => i.id === ing.id
													)}
													onChange={(e) => {
														const updated = e.target
															.checked
															? [
																	...item.ingredients.map(
																		(i) =>
																			i.id
																	),
																	ing.id,
															  ]
															: item.ingredients
																	.filter(
																		(i) =>
																			i.id !==
																			ing.id
																	)
																	.map(
																		(i) =>
																			i.id
																	);
														handleChangeItem(
															order.id,
															index,
															'ingredients',
															updated
														);
													}}
												/>
												{ing.name} (+{ing.price}₽)
											</label>
										))}
									</div>
								</div>
							))}
						</div>

						<div className="flex justify-between items-center">
							<p className="font-semibold text-lg">
								Сумма:{' '}
								{order.items.reduce(
									(sum, i) =>
										sum +
										i.productItem.price * i.quantity +
										i.ingredients.reduce(
											(s, ing) => s + ing.price,
											0
										),
									0
								)}
								₽
							</p>
							<div className="flex gap-2">
								<Button onClick={() => handleSave(order)}>
									💾 Сохранить
								</Button>
								<Button
									variant="destructive"
									onClick={() => handleDelete(order.id)}>
									🗑 Удалить
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			))}

			<div className="flex items-center gap-2">
				<Button
					disabled={page <= 1}
					onClick={() => setPage((p) => p - 1)}>
					Назад
				</Button>
				<span>
					Страница {page} из {totalPages}
				</span>
				<Button
					disabled={page >= totalPages}
					onClick={() => setPage((p) => p + 1)}>
					Вперёд
				</Button>
			</div>
		</div>
	);
}
