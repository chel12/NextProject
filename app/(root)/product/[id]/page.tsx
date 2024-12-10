import { prisma } from '@/prisma/prisma-client';
import { Container, GameImage, Title } from '@/shared/components/shared';
import { GroupVariants } from '@/shared/components/shared/group-variants';
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
				<GameImage imageUrl={product.imageUrl} size={3} />
				<div className="w-[490px] bg-[#F5F5F5] p-7">
					<Title
						text={product.name}
						size="xl"
						className="font-extrabold mb-1"
					/>
					<p className="text-gray-400">инфо о карточке</p>
					<GroupVariants
						selectedValue="2"
						items={[
							{
								name: 'Малое',
								value: '1',
							},
							{
								name: 'Среднее',
								value: '2',
							},
							{
								name: 'Большое',
								value: '3',
								disabled: true,
							},
						]}
					/>
				</div>
			</div>
		</Container>
	);
}
