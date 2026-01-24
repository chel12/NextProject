import { prisma } from '@/prisma/prisma-client';
import { ProfileForm, ProfileOrders, Container } from '@/shared/components';
import { getUserSession } from '@/shared/lib/get-user-session';
import { redirect } from 'next/navigation';

//первым делом проверка авторизации, профиль видно только авторизованным
export default async function ProfilePage() {
	const session = await getUserSession();

	if (!session) {
		return redirect('/not-auth');
	}

	const user = await prisma.user.findFirst({
		where: { id: Number(session?.id) },
	});

	if (!user) return redirect('/not-auth');

	const orders = await prisma.order.findMany({
		where: { userId: user.id },
		orderBy: { createdAt: 'desc' },
	});

	return (
		<Container className="my-10">
			<h1 className="text-3xl font-bold mb-8">Мой профиль</h1>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div>
					<ProfileForm data={user} />
				</div>
				<div>
					<ProfileOrders orders={orders} />
				</div>
			</div>
		</Container>
	);
}
