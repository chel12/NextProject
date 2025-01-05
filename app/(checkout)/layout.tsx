import { Header } from '@/shared/components/shared';

export const metadata = {
	title: 'Next Game | Корзина',
	description: 'Generated by Next.js',
};

export default function CheckoutLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="min-h-screen bg-[#f5f5ff]">
			<Header className="border-gray-200" hasSearch={false} />
			{children}
		</main>
	);
}