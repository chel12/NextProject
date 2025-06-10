import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: { id: true, name: true }
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Ошибка получения категорий:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при загрузке категорий' },
      { status: 500 }
    );
  }
}