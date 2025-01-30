import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '..';
import { CircleUser, SquareUser } from 'lucide-react';
import Link from 'next/link';

interface Props {
	onClickSignIn?: () => void;
	className?: string;
}

export const ProfileButton: React.FC<Props> = ({
	className,
	onClickSignIn,
}) => {
	const { data: session } = useSession();
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
						Профиль
					</Button>
				</Link>
			)}
		</div>
	);
};
