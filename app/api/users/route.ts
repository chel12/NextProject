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
