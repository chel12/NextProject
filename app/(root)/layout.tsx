import { Header } from '@/shared/components/shared';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Next Game | Главная',
	description: 'Интернет магазин на тему компьютерных игр',
};

export default function HomeLayout({
	children,
	modal,
}: Readonly<{
	children: React.ReactNode;
	modal: React.ReactNode;
}>) {
	return (
		<main className="min-h-screen">
			<Header />
			{children}
			{modal}
		</main>
	);
}
