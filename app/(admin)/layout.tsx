import { Container, Header } from '@/shared/components/shared';
import { Suspense } from 'react';

export const metadata = {
	title: 'Next Game | Админка',
	description: 'Админка на Next Game',
};

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="min-h-screen bg-[#e5e5fb]">
			<Container>
				<Suspense>
					<Header
						className="border-b-gray-200"
						hasSearch={false}
						hasCart={false}
					/>
				</Suspense>

				{children}
			</Container>
		</main>
	);
}
