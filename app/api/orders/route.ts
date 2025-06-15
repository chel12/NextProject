import { prisma } from '@/prisma/prisma-client';
import { authOptions } from '@/shared/constants/auth-options';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
	const session = await getServerSession(authOptions);

	// Проверка прав доступа (ADMIN/MANAGER)
	if (
		!session ||
		(session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')
	) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const orders = await prisma.order.findMany({
			include: {
				user: {
					select: {
						id: true,
						fullName: true,
						email: true,
					},
				},
			},
			orderBy: { createdAt: 'desc' },
		});

		return NextResponse.json(orders);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to fetch orders' },
			{ status: 500 }
		);
	}
}
