import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	// console.log(req.nextUrl.searchParams.get('query'));
	//берем с урла
	const query = req.nextUrl.searchParams.get('query')||''
	//В БД обращаемся
	const products = await prisma.product.findMany({
		where:{
			name:{
					contains:query,
					mode:'insensitive'
				}
		},
		//кол-во которое хотим вернуть
		take:5
	})
	return NextResponse.json(products);
}
