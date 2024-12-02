import { Container, ProductImage } from '@/components/shared';
import { prisma } from '@/prisma/prisma-client';
import { notFound } from 'next/navigation';

export default async function ProductPage({
	params: { id },
}: {
	params: { id: string };
}) {
	const product = await prisma.product.findFirst({
		where: { id: Number(id) },
	});
	if (!product) return notFound();

	return (
		<Container className="flex flex-col my-10">
			<div className="flex flex-1">
				<ProductImage imageUrl={product.imageUrl} size={3} />
				<div></div>
			</div>
		</Container>
	);
}
