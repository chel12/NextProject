import { prisma } from '@/prisma/prisma-client';

export async function PATCH(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const body = await req.json();
	const { status } = body;

	const updated = await prisma.order.update({
		where: { id: Number(params.id) },
		data: { status },
	});
	return Response.json(updated);
}

export async function DELETE(
	_: Request,
	{ params }: { params: { id: string } }
) {
	await prisma.order.delete({
		where: { id: Number(params.id) },
	});
	return new Response(null, { status: 204 });
}
