import { prisma } from "@/prisma/prisma-client";

// Получение всех заказов
export async function GET() {
	const orders = await prisma.order.findMany({
		include: { user: true },
		orderBy: { createdAt: 'desc' },
	});
	return Response.json(orders);
}
