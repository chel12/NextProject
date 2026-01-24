import React from 'react';
import { Button } from '..';
import { Eye, Trash2 } from 'lucide-react';

interface UserActionsProps {
	isAdmin: boolean;
	isUpdatingRole: boolean;
	isDeleting: boolean;
	onDeleteUser: (userId: number) => void;
	userId: number;
}

export const UserActions: React.FC<UserActionsProps> = ({
	isAdmin,
	isUpdatingRole,
	isDeleting,
	onDeleteUser,
	userId,
}) => {
	return (
		<div className="flex flex-wrap gap-2">
			<Button
				variant="outline"
				size="sm"
				disabled={isUpdatingRole || isDeleting}>
				<Eye size={16} className="mr-2" />
				Просмотреть
			</Button>
			{isAdmin && ( // Только администратор может удалять пользователей
				<Button
					variant="destructive"
					size="sm"
					onClick={(e) => {
						e.stopPropagation();
						onDeleteUser(userId);
					}}
					disabled={isUpdatingRole || isDeleting}>
					<Trash2 size={16} className="mr-2" />
					{isDeleting ? 'Удаление...' : 'Удалить'}
				</Button>
			)}
		</div>
	);
};
