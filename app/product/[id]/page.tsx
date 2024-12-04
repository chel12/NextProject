import { Container, ProductImage, Title } from '@/components/shared';
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
				<div className="w-[490px] bg-[#F5F5F5] p-7">
					<Title
						text={product.name}
						size="xl"
						className="font-extrabold mb-1"
					/>
					<p className="text-gray-400">инфо о карточке</p>
				</div>
			</div>
		</Container>
	);
}
