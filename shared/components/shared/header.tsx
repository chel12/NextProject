'use client';
import { cn } from '@/shared/lib/utils';
import React, { useEffect, useState } from 'react';
import { Container } from './container';
import Image from 'next/image';
import Link from 'next/link';
import { SearchInput } from './search-input';
import { AuthModal, CartButton, ProfileButton } from '.';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSession, signIn } from 'next-auth/react';
import { set } from 'react-hook-form';

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
	const router = useRouter();
	const [openAuthModal, setOpenAuthModal] = React.useState(false);
	const [userRole, setUserRole] = React.useState<string | null>(null);
	const { data: session } = useSession();
	const searchParams = useSearchParams();

	React.useEffect(() => {
		const fetchUserRole = async () => {
			if (session?.user?.id) {
				try {
					const response = await fetch(
						`/api/users?id=${session.user.id}`,
					);
					if (response.ok) {
						const userData = await response.json();
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

	React.useEffect(() => {
		let toastMessage = '';
		if (searchParams.has('paid')) {
			toastMessage =
				'Покупка прошла успешно, Информация отправлена на почту.';
		}
		if (searchParams.has('verified')) {
			toastMessage = ' Почта успешно подтверждена !';
		}
		if (toastMessage) {
			router.replace('/');
			setTimeout(() => {
				toast.success(toastMessage, {
					duration: 5000,
				});
			}, 1000);
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
					<AuthModal
						open={openAuthModal}
						onCLose={() => setOpenAuthModal(false)}
					/>
					<ProfileButton
						onClickSignIn={() => setOpenAuthModal(true)}
					/>
					{hasCart && userRole !== 'ADMIN' && <CartButton />}
				</div>
			</Container>
		</header>
	);
};
