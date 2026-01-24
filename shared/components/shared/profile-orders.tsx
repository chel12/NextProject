'use client';

import React, { useState } from 'react';
import { Order, OrderStatus } from '@prisma/client';
import { Title, WhiteBlock } from '.';
import { Button } from '..';
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { repeatOrder } from '@/app/actions';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ProfileOrdersProps {
	orders: Order[];
}

const statusLabels: Record<OrderStatus, string> = {
	PENDING: 'В ожидании',
	SUCCEEDED: 'Выполнен',
	CANCELLED: 'Отменён',
};

const statusColors: Record<OrderStatus, string> = {
	PENDING: 'text-yellow-600 bg-yellow-50 border border-yellow-200',
	SUCCEEDED: 'text-green-600 bg-green-50 border border-green-200',
	CANCELLED: 'text-red-600 bg-red-50 border border-red-200',
};

// Тип для данных, которые хранятся в JSON полях заказа
interface Ingredient {
	id: number;
	name: string;
	price: number;
	imageUrl?: string;
	createdAt?: string;
	updatedAt?: string;
}

interface Product {
	id: number;
	name: string;
	imageUrl: string;
	categoryId: number;
	createdAt?: string;
	updatedAt?: string;
}

interface ProductItem {
	id: number;
	price: number;
	gamePlatform?: number;
	gameType?: number;
	productId: number;
	product: Product;
}

interface CartItemFromJSON {
	id?: number;
	cartId?: number;
	productItemId: number;
	quantity: number;
	createdAt?: string;
	updatedAt?: string;
	ingredients: Ingredient[]; // Массив ингредиентов
	productItem: ProductItem;
}

export const ProfileOrders: React.FC<ProfileOrdersProps> = ({ orders }) => {
	const router = useRouter();
	const [expandedOrders, setExpandedOrders] = useState<Set<number>>(
		new Set(),
	);
	const [repeatingOrders, setRepeatingOrders] = useState<Set<number>>(
		new Set(),
	);

	const toggleExpand = (orderId: number) => {
		setExpandedOrders((prev) => {
			const next = new Set(prev);
			if (next.has(orderId)) {
				next.delete(orderId);
			} else {
				next.add(orderId);
			}
			return next;
		});
	};

	const handleRepeatOrder = async (orderId: number, e: React.MouseEvent) => {
		e.stopPropagation();
		setRepeatingOrders((prev) => new Set(prev).add(orderId));
		try {
			await repeatOrder(orderId);
			toast.success('Товары добавлены в корзину', { icon: '🛒' });
			// Перенаправление на страницу оформления заказа
			router.push('/checkout');
		} catch (error) {
			toast.error('Не удалось повторить заказ', { icon: '⚠️' });
		} finally {
			setRepeatingOrders((prev) => {
				const next = new Set(prev);
				next.delete(orderId);
				return next;
			});
		}
	};

	if (orders.length === 0) {
		return (
			<div>
				<Title text="Мои заказы" size="md" className="font-bold mb-5" />
				<WhiteBlock className="py-10 text-center">
					<p className="text-gray-500 mb-4">У вас пока нет заказов</p>
					<Link href="/" className="text-primary">
						Перейти к покупкам
					</Link>
				</WhiteBlock>
			</div>
		);
	}

	return (
		<div>
			<Title text="Мои заказы" size="md" className="font-bold mb-5" />
			<div className="flex flex-col gap-4">
				{orders.map((order) => {
					const itemsData =
						typeof order.items === 'string'
							? JSON.parse(order.items)
							: order.items || [];
					const items = Array.isArray(itemsData)
						? (itemsData as CartItemFromJSON[])
						: [];
					const isExpanded = expandedOrders.has(order.id);
					const isRepeating = repeatingOrders.has(order.id);

					return (
						<WhiteBlock
							key={order.id}
							className={cn(
								'p-5 transition-all duration-200 cursor-pointer hover:shadow-md',
								isExpanded && 'shadow-lg',
							)}
							onClick={() => toggleExpand(order.id)}>
							{/* Header */}
							<div className="flex justify-between items-center">
								<div className="flex items-center gap-4">
									<div>
										<span className="text-gray-500 text-sm">
											Заказ №
										</span>
										<span className="font-semibold ml-1">
											{order.id}
										</span>
									</div>
									<span
										className={cn(
											'px-3 py-1 rounded-full text-sm font-medium',
											statusColors[order.status],
										)}>
										{statusLabels[order.status]}
									</span>
								</div>
								<div className="flex items-center gap-2">
									{isExpanded ? (
										<ChevronUp className="w-5 h-5 text-gray-400" />
									) : (
										<ChevronDown className="w-5 h-5 text-gray-400" />
									)}
								</div>
							</div>

							{/* Main Info */}
							<div className="flex justify-between items-end mt-4">
								<div className="text-sm text-gray-600">
									<p>
										<span className="text-gray-400">
											Дата:
										</span>{' '}
										{new Date(
											order.createdAt,
										).toLocaleDateString('ru-RU', {
											day: '2-digit',
											month: 'long',
											year: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
										})}
									</p>
									<p className="mt-1">
										<span className="text-gray-400">
											Адрес:
										</span>{' '}
										{order.address}
									</p>
								</div>
								<div className="text-right">
									<p className="text-gray-400 text-sm">
										Сумма заказа
									</p>
									<p className="text-xl font-bold">
										{order.totalAmount} ₽
									</p>
								</div>
							</div>

							{/* Expanded Content */}
							{isExpanded && (
								<div className="mt-4 pt-4 border-t border-gray-100">
									{/* Items */}
									<div className="space-y-3 mb-4">
										{items.map((item, index) => {
											return (
												<div
													key={index}
													className="border-b border-gray-100 pb-4 last:border-b-0">
													<div className="flex items-center gap-4 mb-3">
														{item.productItem
															.product
															.imageUrl && (
															<img
																src={
																	item
																		.productItem
																		.product
																		.imageUrl
																}
																alt={
																	item
																		.productItem
																		.product
																		.name
																}
																className="w-16 h-16 rounded-lg object-cover"
															/>
														)}
														<div className="flex-1">
															<h3 className="font-medium text-lg">
																{
																	item
																		.productItem
																		.product
																		.name
																}
															</h3>
															<div className="text-sm text-gray-500 mt-1">
																<p>
																	Цена за
																	единицу:{' '}
																	{
																		item
																			.productItem
																			.price
																	}{' '}
																	₽
																</p>
																<p>
																	Количество:{' '}
																	{
																		item.quantity
																	}{' '}
																	шт.
																</p>
																<p>
																	Общая цена:{' '}
																	{item
																		.productItem
																		.price *
																		item.quantity}{' '}
																	₽
																</p>
															</div>
														</div>
													</div>

													{/* Ingredients Section */}
													{item?.ingredients &&
														Array.isArray(
															item.ingredients,
														) &&
														item.ingredients
															.length > 0 && (
															<div className="ml-20 pl-4 border-l-2 border-gray-200">
																<h4 className="font-medium text-gray-700 mb-2">
																	Ингредиенты:
																</h4>
																<div className="space-y-1">
																	{item.ingredients.map(
																		(
																			ingredient: Ingredient,
																			ingIndex: number,
																		) => (
																			<div
																				key={
																					ingIndex
																				}
																				className="flex justify-between text-sm py-1 border-b border-gray-50">
																				<span className="text-gray-600">
																					{
																						ingredient.name
																					}
																				</span>
																				<div className="flex gap-4">
																					<span className="text-gray-500">
																						+
																						{
																							ingredient.price
																						}
																						&nbsp;₽
																					</span>
																					<span className="text-gray-500">
																						×
																						{
																							item.quantity
																						}
																					</span>
																					<span className="font-medium">
																						=
																						{ingredient.price *
																							item.quantity}
																						&nbsp;₽
																					</span>
																				</div>
																			</div>
																		),
																	)}
																</div>
															</div>
														)}
												</div>
											);
										})}
									</div>

									{order.comment && (
										<p className="text-sm text-gray-500 mb-4 p-3 bg-yellow-50 rounded-lg">
											<span className="font-medium">
												Комментарий:
											</span>{' '}
											{order.comment}
										</p>
									)}

									{/* Repeat Button */}
									<Button
										variant="secondary"
										loading={isRepeating}
										onClick={(e) =>
											handleRepeatOrder(order.id, e)
										}
										className="w-full">
										<RefreshCw className="w-4 h-4 mr-2" />
										Повторить заказ
									</Button>
								</div>
							)}
						</WhiteBlock>
					);
				})}
			</div>
		</div>
	);
};
