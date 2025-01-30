'use client';
import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Container } from './container';
import Image from 'next/image';
import { Button } from '../ui';
import { SquareUser } from 'lucide-react';
import Link from 'next/link';
import { SearchInput } from './search-input';
import { CartButton, ProfileButton } from '.';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSession, signIn } from 'next-auth/react';

interface Props {
	hasSearch?: boolean;
	hasCart?: boolean;
	className?: string;
}

export const Header: React.FC<Props> = ({
	className,
	hasSearch = true,
	hasCart = true,
}) => {
	const { data: session } = useSession();
	const searchParams = useSearchParams();

	React.useEffect(() => {
		if (searchParams.has('paid')) {
			setTimeout(() => {
				toast.success(
					'Покупка прошла успешно, Информация отправлена на почту.'
				);
			}, 500);
		}
	}, []);

	return (
		<header className={cn(' border-b', className)}>
			<Container className="flex items-center justify-between py-8">
				{/* левая часть*/}
				<Link href="/">
					<div className="flex flex-center gap-4">
						<Image
							src="/logo.jpg"
							alt="Logo"
							width={35}
							height={35}
						/>
						<div>
							<h1 className="text-2xl uppercase font-black">
								Next GameShop
							</h1>
							<p className="text-sm text-gray-400 leading-3">
								игры на любой вкус
							</p>
						</div>
					</div>
				</Link>

				{/* ПОИСК*/}
				{hasSearch && (
					<div className="mx-10 flex-1">
						<SearchInput />
					</div>
				)}

				{/* правая часть*/}
				<div className="flex items-center gap-3">
					<ProfileButton />
					{/* <Button
						onClick={() =>
							signIn('github', {
								callbackUrl: '/',
								redirect: true,
							})
						}
						variant="outline"
						className="flex items-center gap-1">
						<SquareUser size={16} />
						Войти
					</Button> */}

					{hasCart && <CartButton />}
				</div>
			</Container>
		</header>
	);
};
