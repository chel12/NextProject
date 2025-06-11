'use client';

import React, { useState, useEffect } from 'react';
import { OrderStatus } from '@prisma/client';
import { toast } from '@/shared/hooks/use-toast';
import {
	Button,
	Checkbox,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Input,
	Select,
} from '@/shared/components';
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/components/ui/select';

type OrderItem = {
	productItemId: number;
	quantity: number;
	ingredients: number[];
};

type ProductItemWithProduct = {
	id: number;
	price: number;
	product: {
		id: number;
		name: string;
		imageUrl: string;
	};
};

type Ingredient = {
	id: number;
	name: string;
	ImageUrl: string;
	price: number;
};

type Order = {
	id: number;
	fullName: string;
	email: string;
	phone: string;
	address: string;
	totalAmount: number;
	status: OrderStatus;
	items: OrderItem[];
};

export default function AdminOrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [productItems, setProductItems] = useState<ProductItemWithProduct[]>(
		[]
	);
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [openDialog, setOpenDialog] = useState(false);

	// Загрузка данных
	useEffect(() => {
		fetch('/api/orders?page=1')
			.then((res) => res.json())
			.then((data) => setOrders(data.orders))
			.catch(() => toast({ title: 'Ошибка загрузки заказов' }));
		fetch('/api/product-items')
			.then((res) => res.json())
			.then(setProductItems);
		fetch('/api/ingredients')
			.then((res) => res.json())
			.then(setIngredients);
	}, []);

	function statusColor(status: OrderStatus) {
		switch (status) {
			case 'PENDING':
				return 'bg-yellow-300 text-yellow-900';
			case 'SUCCEEDED':
				return 'bg-green-300 text-green-900';
			case 'CANCELLED':
				return 'bg-red-300 text-red-900';
			default:
				return '';
		}
	}

	function openOrder(order: Order) {
		setSelectedOrder(order);
		setOpenDialog(true);
	}

	function closeOrder() {
		setSelectedOrder(null);
		setOpenDialog(false);
	}

	// Обработка изменения заказа
	async function saveOrder() {
		if (!selectedOrder) return;

		try {
			const payload = {
				...selectedOrder,
				items: selectedOrder.items.map((item) => ({
					productItemId:
						(item as any).productItem?.id ?? item.productItemId,
					quantity: item.quantity,
					ingredients: item.ingredients.map((ing: any) =>
						typeof ing === 'object' ? ing.id : ing
					),
				})),
			};

			const res = await fetch(`/api/orders/${selectedOrder.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			if (!res.ok) throw new Error();
			toast({ title: 'Заказ обновлён' });
			setOrders((prev) =>
				prev.map((o) => (o.id === selectedOrder.id ? selectedOrder : o))
			);
			closeOrder();
		} catch {
			toast({ title: 'Ошибка при обновлении заказа' });
		}
	}

	// Удаление заказа
	async function deleteOrder(id: number) {
		if (!confirm('Удалить заказ?')) return;
		try {
			const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
			if (!res.ok) throw new Error();
			setOrders((prev) => prev.filter((o) => o.id !== id));
			toast({ title: 'Заказ удалён' });
		} catch {
			toast({ title: 'Ошибка при удалении заказа' });
		}
	}

	// Добавить продукт в заказ
	function addProduct() {
		if (!selectedOrder) return;
		const newItem: OrderItem = {
			productItemId: productItems[0]?.id || 0,
			quantity: 1,
			ingredients: [],
		};
		setSelectedOrder({
			...selectedOrder,
			items: [...selectedOrder.items, newItem],
		});
	}

	// Обновить поле в элементе заказа
	function updateOrderItem(
		index: number,
		field: keyof OrderItem,
		value: any
	) {
		if (!selectedOrder) return;
		const items = [...selectedOrder.items];
		items[index] = { ...items[index], [field]: value };
		setSelectedOrder({ ...selectedOrder, items });
	}

	// Переключить ингредиент в элементе заказа
	function toggleIngredient(index: number, ingredientId: number) {
		if (!selectedOrder) return;
		const items = [...selectedOrder.items];
		const ingredientsSet = new Set(items[index].ingredients);
		if (ingredientsSet.has(ingredientId))
			ingredientsSet.delete(ingredientId);
		else ingredientsSet.add(ingredientId);
		items[index].ingredients = Array.from(ingredientsSet);
		setSelectedOrder({ ...selectedOrder, items });
	}

	// Считаем сумму заказа
	function calcTotalAmount() {
		if (!selectedOrder) return 0;
		let sum = 0;
		selectedOrder.items.forEach((item) => {
			const pi = productItems.find((p) => p.id === item.productItemId);
			if (!pi) return;
			sum += pi.price * item.quantity;
			// Добавляем цену ингредиентов
			item.ingredients.forEach((ingId) => {
				const ing = ingredients.find((i) => i.id === ingId);
				if (ing) sum += ing.price * item.quantity;
			});
		});
		return sum;
	}

	// Обновляем сумму при изменениях
	React.useEffect(() => {
		if (selectedOrder) {
			const newTotal = calcTotalAmount();
			if (newTotal !== selectedOrder.totalAmount) {
				setSelectedOrder((prev) =>
					prev ? { ...prev, totalAmount: newTotal } : null
				);
			}
		}
	}, [selectedOrder?.items]);

	return (
		<div className="p-4">
			<h1 className="text-2xl mb-4">Админка заказов</h1>

			<table className="w-full border-collapse border border-gray-300">
				<thead>
					<tr>
						<th className="border border-gray-300 p-2">ID</th>
						<th className="border border-gray-300 p-2">Имя</th>
						<th className="border border-gray-300 p-2">Почта</th>
						<th className="border border-gray-300 p-2">Адрес</th>
						<th className="border border-gray-300 p-2">Сумма</th>
						<th className="border border-gray-300 p-2">Статус</th>
						<th className="border border-gray-300 p-2">Действия</th>
					</tr>
				</thead>
				<tbody>
					{orders.map((order) => (
						<tr
							key={order.id}
							className="cursor-pointer hover:bg-gray-100"
							onClick={() => openOrder(order)}>
							<td className="border border-gray-300 p-2">
								{order.id}
							</td>
							<td className="border border-gray-300 p-2">
								{order.fullName}
							</td>
							<td className="border border-gray-300 p-2">
								{order.email}
							</td>
							<td className="border border-gray-300 p-2">
								{order.address}
							</td>
							<td className="border border-gray-300 p-2">
								{order.totalAmount} ₽
							</td>
							<td
								className={`border border-gray-300 p-2 ${statusColor(
									order.status
								)}`}>
								{order.status}
							</td>
							<td className="border border-gray-300 p-2">
								<Button
									variant="destructive"
									size="sm"
									onClick={(e) => {
										e.stopPropagation();
										deleteOrder(order.id);
									}}>
									Удалить
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<Dialog open={openDialog} onOpenChange={setOpenDialog}>
				<DialogContent className="max-w-3xl">
					<DialogHeader>
						<DialogTitle>
							Редактирование заказа #{selectedOrder?.id}
						</DialogTitle>
					</DialogHeader>
					{selectedOrder && (
						<div className="space-y-4">
							<Input
								value={selectedOrder.fullName}
								onChange={(e) =>
									setSelectedOrder({
										...selectedOrder,
										fullName: e.target.value,
									})
								}
								placeholder="Имя"
							/>
							<Input
								value={selectedOrder.phone}
								onChange={(e) =>
									setSelectedOrder({
										...selectedOrder,
										phone: e.target.value,
									})
								}
								placeholder="Телефон"
							/>
							<Input
								value={selectedOrder.email}
								onChange={(e) =>
									setSelectedOrder({
										...selectedOrder,
										email: e.target.value,
									})
								}
								placeholder="Почта"
								type="email"
							/>
							<Input
								value={selectedOrder.address}
								onChange={(e) =>
									setSelectedOrder({
										...selectedOrder,
										address: e.target.value,
									})
								}
								placeholder="Адрес"
							/>

							<Select
								value={selectedOrder.status}
								onValueChange={(val) =>
									setSelectedOrder({
										...selectedOrder,
										status: val as OrderStatus,
									})
								}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Выберите статус" />
								</SelectTrigger>
								<SelectContent>
									{Object.values(OrderStatus).map(
										(status) => (
											<SelectItem
												key={status}
												value={status}>
												{status}
											</SelectItem>
										)
									)}
								</SelectContent>
							</Select>

							<h3 className="text-lg font-semibold">Товары</h3>
							{selectedOrder.items.map((item, idx) => {
								const productItem = productItems.find(
									(pi) => pi.id === item.productItemId
								);
								if (!productItem) return null;

								return (
									<div
										key={idx}
										className="border p-3 rounded mb-3">
										<div className="flex items-center space-x-4">
											<img
												src={
													productItem.product.imageUrl
												}
												alt={productItem.product.name}
												className="w-16 h-16 object-cover rounded"
											/>
											<Select
												value={String(
													item.productItemId
												)}
												onValueChange={(val) =>
													updateOrderItem(
														idx,
														'productItemId',
														Number(val)
													)
												}>
												<SelectTrigger className="w-48">
													<SelectValue placeholder="Товар" />
												</SelectTrigger>
												<SelectContent>
													{productItems.map((pi) => (
														<SelectItem
															key={pi.id}
															value={String(
																pi.id
															)}>
															{pi.product.name} —{' '}
															{pi.price} ₽
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<Input
												type="number"
												min={1}
												value={item.quantity}
												onChange={(e) =>
													updateOrderItem(
														idx,
														'quantity',
														Number(e.target.value)
													)
												}
												className="w-20"
											/>
											<Button
												variant="destructive"
												onClick={() => {
													setSelectedOrder({
														...selectedOrder,
														items: selectedOrder.items.filter(
															(_, i) => i !== idx
														),
													});
												}}>
												Удалить
											</Button>
										</div>
										<div className="mt-2 grid grid-cols-4 gap-2">
											{ingredients.map((ingredient) => (
												<label
													key={ingredient.id}
													className="flex items-center space-x-1 cursor-pointer">
													<Checkbox
														checked={item.ingredients.includes(
															ingredient.id
														)}
														onCheckedChange={() =>
															toggleIngredient(
																idx,
																ingredient.id
															)
														}
													/>
													<img
														src={
															ingredient.ImageUrl
														}
														alt={ingredient.name}
														className="w-6 h-6 rounded"
													/>
													<span>
														{ingredient.name}
													</span>
												</label>
											))}
										</div>
									</div>
								);
							})}

							<Button onClick={addProduct}>Добавить товар</Button>

							<div className="mt-4 text-right font-bold text-lg">
								Итого: {selectedOrder.totalAmount} ₽
							</div>

							<DialogFooter>
								<Button variant="outline" onClick={closeOrder}>
									Отмена
								</Button>
								<Button onClick={saveOrder}>Сохранить</Button>
							</DialogFooter>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
