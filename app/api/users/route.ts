import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
	const users = await prisma.user.findMany();
	return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
	//получить data из запроса
	const data = await req.json();
	//ждём создание пользователя в БД
	const user = await prisma.user.create({
		data,
	});
	return NextResponse.json(user);
}
// app/api/users/route.ts
export async function PUT(req: NextRequest) {
	const data = await req.json();
	const { id, ...rest } = data;

	const updatedUser = await prisma.user.update({
		where: { id },
		data: rest,
	});
	return NextResponse.json(updatedUser);
}

export async function DELETE(req: NextRequest) {
	const { id } = await req.json();
	await prisma.user.delete({ where: { id } });
	return NextResponse.json({ message: 'User deleted' });
}
