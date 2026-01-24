import React from 'react';

interface UserRoleManagerProps {
	user: any;
	isAdmin: boolean;
	isUpdatingRole: boolean;
	onChangeRole: (userId: number, newRole: string) => void;
}

export const UserRoleManager: React.FC<UserRoleManagerProps> = ({
	user,
	isAdmin,
	isUpdatingRole,
	onChangeRole,
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
		<div className="p-3 bg-gray-50 rounded-lg">
			<p className="text-sm text-gray-500">Роль</p>
			{isAdmin ? ( // Только администратор может изменять роли
				<select
					value={user.role}
					onChange={(e) => onChangeRole(user.id, e.target.value)}
					onClick={(e) => e.stopPropagation()}
					disabled={isUpdatingRole}
					className="border rounded px-2 py-1 text-sm mt-1 w-full">
					<option value="USER">Пользователь</option>
					<option value="MANAGER">Менеджер</option>
					<option value="ADMIN">Администратор</option>
				</select>
			) : (
				<p className="font-medium">{roleText}</p>
			)}
		</div>
	);
};
