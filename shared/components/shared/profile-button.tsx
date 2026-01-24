'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '..';
import { CircleUser, SquareUser, Package } from 'lucide-react';
import Link from 'next/link';

interface Props {
	onClickSignIn?: () => void;
	className?: string;
}

interface UserWithRole {
	id: number;
	role: string;
}

export const ProfileButton: React.FC<Props> = ({
	className,
	onClickSignIn,
}) => {
	const { data: session } = useSession();
	const [userRole, setUserRole] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserRole = async () => {
			if (session?.user?.id) {
				try {
					const response = await fetch(
						`/api/users?id=${session.user.id}`,
					);
					if (response.ok) {
						const userData: UserWithRole = await response.json();
						setUserRole(userData.role);
					}
				} catch (error) {
					console.error('Error fetching user role:', error);
				}
			}
		};

		if (session) {
			fetchUserRole();
		} else {
			setUserRole(null);
		}
	}, [session]);

	const isAdmin = userRole === 'ADMIN';

	return (
		<div className={className}>
			{!session ? (
				<Button
					onClick={onClickSignIn}
					variant="outline"
					className="flex items-center gap-1">
					<SquareUser size={16} />
					Войти
				</Button>
			) : (
				<Link href="/profile">
					<Button
						variant="secondary"
						className="flex items-center gap-2">
						<CircleUser size={16} />
						{session.user?.name || 'Профиль'}
						{userRole === 'ADMIN' && '(Админ)'}
						{userRole === 'MANAGER' && '(Менеджер)'}
					</Button>
				</Link>
			)}
		</div>
	);
};
