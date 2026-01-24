'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@prisma/client';
import { Title, WhiteBlock } from '.';
import { Button } from '..';
import {
	ChevronDown,
	ChevronUp,
	User as UserIcon,
	Eye,
	Edit,
	Trash2,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import toast from 'react-hot-toast';
import { updateUserRole, deleteUser } from '@/app/actions';
import { UserInfoCard } from './user-info-card';
import { UserRoleManager } from './user-role-manager';
import { UserActions } from './user-actions';

interface AdminUsersPanelProps {
	isAdmin: boolean;
	isManager?: boolean;
	users?: any[];
	currentPage?: number;
	totalPages?: number;
}

interface ExtendedUser extends User {
	orderCount?: number; // Количество заказов пользователя
}

export const AdminUsersPanel: React.FC<AdminUsersPanelProps> = ({
	isAdmin,
	isManager = false,
	users: propUsers,
	currentPage = 1,
	totalPages = 1,
}) => {
	const [users, setUsers] = useState<ExtendedUser[]>(propUsers || []);
	const [loading, setLoading] = useState(!propUsers);
	const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set());
	const [updatingRoles, setUpdatingRoles] = useState<Set<number>>(new Set());
	const [deletingUsers, setDeletingUsers] = useState<Set<number>>(new Set());

	useEffect(() => {
		if (propUsers) {
			setUsers(propUsers);
			setLoading(false);
		} else if (isAdmin || isManager) {
			fetchUsers();
		}
	}, [propUsers, isAdmin, isManager]);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/users/list');
			if (response.ok) {
				const data = await response.json();
				setUsers(data.users);
			} else {
				throw new Error('Failed to fetch users');
			}
		} catch (error) {
			console.error('Error fetching users:', error);
			toast.error('Ошибка загрузки списка пользователей');
		} finally {
			setLoading(false);
		}
	};

	const toggleExpand = (userId: number) => {
		setExpandedUsers((prev) => {
			const next = new Set(prev);
			if (next.has(userId)) {
				next.delete(userId);
			} else {
				next.add(userId);
			}
			return next;
		});
	};

	const handleChangeRole = async (userId: number, newRole: string) => {
		if (!isAdmin) return; // Только администратор может изменять роли

		setUpdatingRoles((prev) => new Set(prev).add(userId));
		try {
			await updateUserRole(userId, newRole);
			setUsers((prev) =>
				prev.map((user) =>
					user.id === userId
						? { ...user, role: newRole as any }
						: user,
				),
			);
			toast.success('Роль пользователя обновлена');
		} catch (error) {
			console.error('Error updating user role:', error);
			toast.error('Ошибка обновления роли пользователя');
		} finally {
			setUpdatingRoles((prev) => {
				const next = new Set(prev);
				next.delete(userId);
				return next;
			});
		}
	};

	const handleDeleteUser = async (userId: number) => {
		if (!isAdmin) return; // Только администратор может удалять пользователей

		if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
			return;
		}

		setDeletingUsers((prev) => new Set(prev).add(userId));
		try {
			await deleteUser(userId);
			setUsers((prev) => prev.filter((user) => user.id !== userId));
			toast.success('Пользователь удален');
		} catch (error) {
			console.error('Error deleting user:', error);
			toast.error('Ошибка удаления пользователя');
		} finally {
			setDeletingUsers((prev) => {
				const next = new Set(prev);
				next.delete(userId);
				return next;
			});
		}
	};

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

	if (!(isAdmin || isManager)) {
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

	return (
		<WhiteBlock className="p-5">
			<Title text="" size="md" className="font-bold mb-5" />

			{users.length === 0 ? (
				<p className="text-gray-500 text-center py-4">
					Нет пользователей
				</p>
			) : (
				<div className="flex flex-col gap-4">
					{users.map((user) => {
						const isExpanded = expandedUsers.has(user.id);
						const isUpdatingRole = updatingRoles.has(user.id);
						const isDeleting = deletingUsers.has(user.id);

						// Определение цвета и текста для роли
						let roleColorClass =
							'text-gray-600 bg-gray-50 border border-gray-200';
						let roleText = 'Пользователь';

						if (user.role === 'ADMIN') {
							roleColorClass =
								'text-blue-600 bg-blue-50 border border-blue-200';
							roleText = 'Администратор';
						} else if (user.role === 'MANAGER') {
							roleColorClass =
								'text-purple-600 bg-purple-50 border border-purple-200';
							roleText = 'Менеджер';
						}

						return (
							<div key={user.id}>
								<UserInfoCard
									user={user}
									isExpanded={isExpanded}
									onClick={() => toggleExpand(user.id)}
								/>

								{isExpanded && (
									<div className="mt-4 pt-4 border-t border-gray-100 border-l border-r rounded-b-lg p-4 bg-white">
										<div className="grid grid-cols-2 gap-4 mb-4">
											<div className="p-3 bg-gray-50 rounded-lg">
												<p className="text-sm text-gray-500">
													ID пользователя
												</p>
												<p className="font-medium">
													{user.id}
												</p>
											</div>
											<UserRoleManager
												user={user}
												isAdmin={isAdmin}
												isUpdatingRole={isUpdatingRole}
												onChangeRole={handleChangeRole}
											/>
											<div className="p-3 bg-gray-50 rounded-lg">
												<p className="text-sm text-gray-500">
													Дата создания
												</p>
												<p className="font-medium">
													{new Date(
														user.createdAt,
													).toLocaleDateString(
														'ru-RU',
													)}
												</p>
											</div>
											<div className="p-3 bg-gray-50 rounded-lg">
												<p className="text-sm text-gray-500">
													Последнее обновление
												</p>
												<p className="font-medium">
													{new Date(
														user.updatedAt,
													).toLocaleDateString(
														'ru-RU',
													)}
												</p>
											</div>
										</div>

										<UserActions
											isAdmin={isAdmin}
											isUpdatingRole={isUpdatingRole}
											isDeleting={isDeleting}
											onDeleteUser={handleDeleteUser}
											userId={user.id}
										/>
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
			{totalPages > 1 && <Pagination />}
		</WhiteBlock>
	);
};
