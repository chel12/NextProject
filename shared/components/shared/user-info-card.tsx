import React from 'react';
import { User } from '@prisma/client';
import { cn } from '@/shared/lib/utils';
import { UserIcon, ChevronDown, ChevronUp } from 'lucide-react';

interface UserInfoCardProps {
	user: User & { orderCount?: number };
	isExpanded: boolean;
	onClick: () => void;
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({
	user,
	isExpanded,
	onClick,
}) => {
	// Определение цвета и текста для роли
	let roleColorClass = 'text-gray-600 bg-gray-50 border border-gray-200';
	let roleText = 'Пользователь';

	if (user.role === 'ADMIN') {
		roleColorClass = 'text-blue-600 bg-blue-50 border border-blue-200';
		roleText = 'Администратор';
	} else if (user.role === 'MANAGER') {
		roleColorClass =
			'text-purple-600 bg-purple-50 border border-purple-200';
		roleText = 'Менеджер';
	}

	return (
		<div
			className={cn(
				'border rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-md',
				isExpanded && 'shadow-lg',
			)}
			onClick={onClick}>
			{/* Header */}
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<UserIcon size={16} />
						<span className="text-gray-500 text-sm">
							ID: {user.id}
						</span>
					</div>
					<div>
						<span className="font-medium">{user.fullName}</span>
					</div>
					<span
						className={cn(
							'px-3 py-1 rounded-full text-sm font-medium',
							roleColorClass,
						)}>
						{roleText}
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
						<span className="text-gray-400">Email:</span>{' '}
						{user.email}
					</p>
					<p className="mt-1">
						<span className="text-gray-400">Дата регистрации:</span>{' '}
						{new Date(user.createdAt).toLocaleDateString('ru-RU', {
							day: '2-digit',
							month: 'long',
							year: 'numeric',
							hour: '2-digit',
							minute: '2-digit',
						})}
					</p>
				</div>
			</div>
		</div>
	);
};
