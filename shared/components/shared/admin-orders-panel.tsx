'use client';

import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, User } from '@prisma/client';
import { Title, WhiteBlock } from '.';
import { Button } from '..';
import {
	ChevronDown,
	ChevronUp,
	Package,
	User as UserIcon,
	Users,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import toast from 'react-hot-toast';
import { updateOrderStatus, deleteOrder } from '@/app/actions';
import { AdminUsersPanel } from './admin-users-panel';

interface AdminOrdersPanelProps {
	isAdmin: boolean;
	isManager?: boolean;
	orders?: any[];
	currentPage?: number;
	totalPages?: number;
}

interface ExtendedOrder extends Order {
	user?: User;
	items: any[]; // Массив элементов заказа
}

export const AdminOrdersPanel: React.FC<AdminOrdersPanelProps> = ({
	isAdmin,
	isManager = false,
	orders: propOrders,
	currentPage = 1,
	totalPages = 1,
}) => {
	const [activeTab, setActiveTab] = useState<'orders' | 'users'>('orders'); // Добавляем состояние для активной вкладки
	const [orders, setOrders] = useState<ExtendedOrder[]>(propOrders || []);
	const [loading, setLoading] = useState(!propOrders);
	const [expandedOrders, setExpandedOrders] = useState<Set<number>>(
		new Set(),
	);
	const [updatingStatus, setUpdatingStatus] = useState<Set<number>>(
		new Set(),
	);

	useEffect(() => {
		if (propOrders) {
			setOrders(propOrders);
			setLoading(false);
		}
	}, [propOrders]);

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

	const handleChangeStatus = async (
		orderId: number,
		newStatus: OrderStatus,
	) => {
		setUpdatingStatus((prev) => new Set(prev).add(orderId));
		try {
			await updateOrderStatus(orderId, newStatus);
			setOrders((prev) =>
				prev.map((order) =>
					order.id === orderId
						? { ...order, status: newStatus }
						: order,
				),
			);
			toast.success('Статус заказа обновлен');
		} catch (error) {
			console.error('Error updating order status:', error);
			toast.error('Ошибка обновления статуса заказа');
		} finally {
			setUpdatingStatus((prev) => {
				const next = new Set(prev);
				next.delete(orderId);
				return next;
			});
		}
	};

	const handleDeleteOrder = async (orderId: number) => {
		if (!confirm('Вы уверены, что хотите удалить этот заказ?')) {
			return;
		}

		try {
			await deleteOrder(orderId);
			setOrders((prev) => prev.filter((order) => order.id !== orderId));
			toast.success('Заказ удален');
		} catch (error) {
			console.error('Error deleting order:', error);
			toast.error('Ошибка удаления заказа');
		}
	};

	if (!isAdmin && !isManager) {
		return null;
	}

	if (loading) {
		return (
			<WhiteBlock className="p-6">
				<div className="animate-pulse">
					<div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
					{[...Array(3)].map((_, idx) => (
						<div
							key={idx}
							className="h-16 bg-gray-100 rounded mb-4"></div>
					))}
				</div>
			</WhiteBlock>
		);
	}

	// Пагинация
	const Pagination = () => {
		const maxVisiblePages = 5;
		const startPage = Math.max(
			1,
			currentPage - Math.floor(maxVisiblePages / 2),
		);
		const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

		const pages = [];
		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		return (
			<div className="flex justify-center items-center gap-2 mt-6">
				<Button
					variant="outline"
					disabled={currentPage <= 1}
					onClick={() => {
						const url = new URL(window.location.href);
						url.searchParams.set(
							'page',
							(currentPage - 1).toString(),
						);
						window.location.href = url.toString();
					}}>
					Предыдущая
				</Button>

				{startPage > 1 && (
					<>
						<Button
							variant={currentPage === 1 ? 'default' : 'outline'}
							onClick={() => {
								const url = new URL(window.location.href);
								url.searchParams.set('page', '1');
								window.location.href = url.toString();
							}}>
							1
						</Button>
						{startPage > 2 && <span className="px-2">...</span>}
					</>
				)}

				{pages.map((page) => (
					<Button
						key={page}
						variant={currentPage === page ? 'default' : 'outline'}
						onClick={() => {
							const url = new URL(window.location.href);
							url.searchParams.set('page', page.toString());
							window.location.href = url.toString();
						}}>
						{page}
					</Button>
				))}

				{endPage < totalPages && (
					<>
						{endPage < totalPages - 1 && (
							<span className="px-2">...</span>
						)}
						<Button
							variant={
								currentPage === totalPages
									? 'default'
									: 'outline'
							}
							onClick={() => {
								const url = new URL(window.location.href);
								url.searchParams.set(
									'page',
									totalPages.toString(),
								);
								window.location.href = url.toString();
							}}>
							{totalPages}
						</Button>
					</>
				)}

				<Button
					variant="outline"
					disabled={currentPage >= totalPages}
					onClick={() => {
						const url = new URL(window.location.href);
						url.searchParams.set(
							'page',
							(currentPage + 1).toString(),
						);
						window.location.href = url.toString();
					}}>
					Следующая
				</Button>
			</div>
		);
	};

	return (
		<WhiteBlock className="p-5">
			{activeTab === 'orders' ? (
				<>
					<Title text="" size="md" className="font-bold mb-5" />

					{orders.length === 0 ? (
						<p className="text-gray-500 text-center py-4">
							Нет заказов
						</p>
					) : (
						<div className="flex flex-col gap-4">
							{orders.map((order) => {
								const items = Array.isArray(order.items)
									? order.items
									: [];
								const isExpanded = expandedOrders.has(order.id);
								const isUpdating = updatingStatus.has(order.id);

								return (
									<div
										key={order.id}
										className={cn(
											'border rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-md',
											isExpanded && 'shadow-lg',
										)}
										onClick={() => toggleExpand(order.id)}>
										{/* Header */}
										<div className="flex justify-between items-center">
											<div className="flex items-center gap-4">
												<div className="flex items-center gap-2">
													<UserIcon size={16} />
													<span className="text-gray-500 text-sm">
														Пользователь:{' '}
														{order.user?.fullName ||
															'N/A'}
													</span>
												</div>
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
														order.status ===
															'PENDING' &&
															'text-yellow-600 bg-yellow-50 border border-yellow-200',
														order.status ===
															'SUCCEEDED' &&
															'text-green-600 bg-green-50 border border-green-200',
														order.status ===
															'CANCELLED' &&
															'text-red-600 bg-red-50 border border-red-200',
													)}>
													{order.status === 'PENDING'
														? 'В ожидании'
														: order.status ===
															  'SUCCEEDED'
															? 'Выполнен'
															: 'Отменён'}
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
													).toLocaleDateString(
														'ru-RU',
														{
															day: '2-digit',
															month: 'long',
															year: 'numeric',
															hour: '2-digit',
															minute: '2-digit',
														},
													)}
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
												{/* Status Controls */}
												<div className="mb-4 p-3 bg-gray-50 rounded-lg">
													<p className="font-medium mb-2">
														Изменить статус:
													</p>
													<div className="flex flex-wrap gap-2">
														{(
															[
																'PENDING',
																'SUCCEEDED',
																'CANCELLED',
															] as OrderStatus[]
														).map((status) => (
															<Button
																key={status}
																variant={
																	order.status ===
																	status
																		? 'default'
																		: 'outline'
																}
																size="sm"
																onClick={(
																	e,
																) => {
																	e.stopPropagation();
																	handleChangeStatus(
																		order.id,
																		status,
																	);
																}}
																disabled={
																	isUpdating
																}>
																{status ===
																'PENDING'
																	? 'В ожидании'
																	: status ===
																		  'SUCCEEDED'
																		? 'Выполнен'
																		: 'Отменён'}
															</Button>
														))}
														{isAdmin && (
															<Button
																variant="destructive"
																size="sm"
																onClick={(
																	e,
																) => {
																	e.stopPropagation();
																	handleDeleteOrder(
																		order.id,
																	);
																}}
																disabled={
																	isUpdating
																}>
																Удалить заказ
															</Button>
														)}
													</div>
												</div>

												{/* Items */}
												<div className="space-y-3 mb-4">
													{items.map(
														(item, index) => {
															const product =
																typeof item ===
																	'object' &&
																item.productItem
																	?.product
																	? item
																			.productItem
																			.product
																	: {
																			name: 'Неизвестный товар',
																			imageUrl:
																				'',
																		};

															return (
																<div
																	key={index}
																	className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
																	{product.imageUrl && (
																		<img
																			src={
																				product.imageUrl
																			}
																			alt={
																				product.name
																			}
																			className="w-16 h-16 rounded-lg object-cover"
																		/>
																	)}
																	<div className="flex-1">
																		<p className="font-medium">
																			{
																				product.name
																			}
																		</p>
																		{item
																			.productItem
																			?.ingredients &&
																			Array.isArray(
																				item
																					.productItem
																					.ingredients,
																			) &&
																			item
																				.productItem
																				.ingredients
																				.length >
																				0 && (
																				<div className="text-sm text-gray-500 mt-1">
																					<p>
																						Ингредиенты:
																					</p>
																					{item.productItem.ingredients.map(
																						(
																							ing: any,
																							idx: number,
																						) => (
																							<span
																								key={
																									idx
																								}
																								className="block">
																								•{' '}
																								{
																									ing.name
																								}{' '}
																								+
																								{
																									ing.price
																								}{' '}
																								₽
																							</span>
																						),
																					)}
																				</div>
																			)}
																	</div>
																	<div className="text-right">
																		<p className="font-medium">
																			x
																			{
																				item.quantity
																			}
																		</p>
																		<p className="text-sm text-gray-500">
																			{(item
																				.productItem
																				?.price ||
																				0) *
																				item.quantity}{' '}
																			₽
																		</p>
																	</div>
																</div>
															);
														},
													)}
												</div>

												{order.comment && (
													<p className="text-sm text-gray-500 mb-4 p-3 bg-yellow-50 rounded-lg">
														<span className="font-medium">
															Комментарий:
														</span>{' '}
														{order.comment}
													</p>
												)}
											</div>
										)}
									</div>
								);
							})}
						</div>
					)}
					{totalPages > 1 && (
						<div className="flex justify-center items-center gap-2 mt-6">
							<Button
								variant="outline"
								disabled={currentPage <= 1}
								onClick={() => {
									const url = new URL(window.location.href);
									url.searchParams.set(
										'page',
										(currentPage - 1).toString(),
									);
									window.location.href = url.toString();
								}}>
								Предыдущая
							</Button>

							{Math.max(1, currentPage - Math.floor(5 / 2)) >
								1 && (
								<>
									<Button
										variant={
											currentPage === 1
												? 'default'
												: 'outline'
										}
										onClick={() => {
											const url = new URL(
												window.location.href,
											);
											url.searchParams.set('page', '1');
											window.location.href =
												url.toString();
										}}>
										1
									</Button>
									{Math.max(
										1,
										currentPage - Math.floor(5 / 2),
									) > 2 && <span className="px-2">...</span>}
								</>
							)}

							{Array.from(
								{ length: Math.min(5, totalPages) },
								(_, i) => {
									const startPage = Math.max(
										1,
										currentPage - Math.floor(5 / 2),
									);
									const endPage = Math.min(
										totalPages,
										startPage + 5 - 1,
									);
									const page = startPage + i;

									// Проверяем, что page не превышает totalPages
									if (page > endPage) return null;

									return (
										<Button
											key={page}
											variant={
												currentPage === page
													? 'default'
													: 'outline'
											}
											onClick={() => {
												const url = new URL(
													window.location.href,
												);
												url.searchParams.set(
													'page',
													page.toString(),
												);
												window.location.href =
													url.toString();
											}}>
											{page}
										</Button>
									);
								},
							).filter(Boolean)}

							{Math.min(
								totalPages,
								Math.max(1, currentPage - Math.floor(5 / 2)) +
									5 -
									1,
							) < totalPages && (
								<>
									{Math.min(
										totalPages,
										Math.max(
											1,
											currentPage - Math.floor(5 / 2),
										) +
											5 -
											1,
									) <
										totalPages - 1 && (
										<span className="px-2">...</span>
									)}
									<Button
										variant={
											currentPage === totalPages
												? 'default'
												: 'outline'
										}
										onClick={() => {
											const url = new URL(
												window.location.href,
											);
											url.searchParams.set(
												'page',
												totalPages.toString(),
											);
											window.location.href =
												url.toString();
										}}>
										{totalPages}
									</Button>
								</>
							)}

							<Button
								variant="outline"
								disabled={currentPage >= totalPages}
								onClick={() => {
									const url = new URL(window.location.href);
									url.searchParams.set(
										'page',
										(currentPage + 1).toString(),
									);
									window.location.href = url.toString();
								}}>
								Следующая
							</Button>
						</div>
					)}
				</>
			) : (
				<AdminUsersPanel
					isAdmin={true}
					isManager={false}
					currentPage={currentPage}
					totalPages={totalPages}
				/>
			)}
		</WhiteBlock>
	);
};
