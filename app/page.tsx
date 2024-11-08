import { Container, Filters, Title, TopBar } from '@/components/shared';
import { ProductCard } from '@/components/shared/product-card';
import { ProductsGroupList } from '@/components/shared/products-group-list';

export default function Home() {
	return (
		<>
			<Container className="mt-10">
				<Title text="Все игры" size="lg" className="font-extrabold" />
			</Container>
			<TopBar />
			<Container className="mt-10 pb-14">
				<div className="flex gap-[60px]">
					{/*Филтьтрация*/}
					<div className="w-[250px]">
						<Filters />
					</div>
					{/*Список товаров*/}
					<div className="flex-1">
						<div className="flex flex-col gap-16">
							<ProductsGroupList
								title={'Игры'}
								items={[
									{
										id: 1,
										name: 'The Witcher 3: Wild Hunt',
										price: 2499,
										imageUrl:
											'https://example.com/witcher3.jpg',
									},
									{
										id: 2,
										name: 'Cyberpunk 2077',
										price: 2999,
										imageUrl:
											'https://example.com/cyberpunk2077.jpg',
									},
									{
										id: 3,
										name: 'Red Dead Redemption 2',
										price: 2899,
										imageUrl:
											'https://example.com/rdr2.jpg',
									},
									{
										id: 4,
										name: 'Minecraft',
										price: 899,
										imageUrl:
											'https://example.com/minecraft.jpg',
									},
									{
										id: 5,
										name: "Assassin's Creed Valhalla",
										price: 1999,
										imageUrl:
											'https://example.com/acvalhalla.jpg',
									},
								]}
								categoryId={1}
							/>
						</div>
					</div>
				</div>
			</Container>
		</>
	);
}
