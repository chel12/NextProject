import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export async function GET() {
	const items = await prisma.productItem.findMany({
		include: {
			product: true,
		},
	});
	return NextResponse.json(items);
}
