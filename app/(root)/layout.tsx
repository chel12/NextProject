import type { Metadata } from 'next';
import { Header } from '@/components/shared/header';

export const metadata: Metadata = {
	title: 'Next Game | Главная',
	description: 'Интернет магазин на тему компьютерных игр',
};

export default function HomeLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="min-h-screen">
			<Header />
			{children}
		</main>
	);
}
