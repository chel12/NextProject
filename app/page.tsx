import { Container, Filters, Title, TopBar } from '@/components/shared';
import { ProductsGroupList } from '@/components/shared/products-group-list';

export default function Home() {
	return (
		<>
			<Container className="mt-10">
				<Title text="Все игры" size="lg" className="font-extrabold" />
			</Container>
			<TopBar />
			<Container className="mt-10 pb-14">
				<div className="flex gap-[80px]">
					{/*Филтьтрация*/}
					<div className="w-[250px]">
						<Filters />
					</div>
					{/*Список товаров*/}
					<div className="flex-1">
						<div className="flex flex-col gap-16">
							<ProductsGroupList
								title={'Шутеры'}
								items={[
									{
										id: 1,
										name: 'The Witcher 3: Wild Hunt',
										price: 2499,
										imageUrl:
											'https://upload.wikimedia.org/wikipedia/ru/thumb/a/a2/The_Witcher_3-_Wild_Hunt_Cover.jpg/266px-The_Witcher_3-_Wild_Hunt_Cover.jpg',
									},
									{
										id: 2,
										name: 'Cyberpunk 2077',
										price: 2999,
										imageUrl:
											'https://upload.wikimedia.org/wikipedia/ru/thumb/b/bb/%D0%9E%D0%B1%D0%BB%D0%BE%D0%B6%D0%BA%D0%B0_%D0%BA%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%D0%BD%D0%BE%D0%B9_%D0%B8%D0%B3%D1%80%D1%8B_Cyberpunk_2077.jpg/274px-%D0%9E%D0%B1%D0%BB%D0%BE%D0%B6%D0%BA%D0%B0_%D0%BA%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%D0%BD%D0%BE%D0%B9_%D0%B8%D0%B3%D1%80%D1%8B_Cyberpunk_2077.jpg',
									},
									{
										id: 3,
										name: 'Red Dead Redemption 2',
										price: 2899,
										imageUrl:
											'https://upload.wikimedia.org/wikipedia/ru/thumb/0/03/Red_Dead_Redemption_2_coverart.jpg/220px-Red_Dead_Redemption_2_coverart.jpg',
									},
									{
										id: 4,
										name: 'Minecraft',
										price: 899,
										imageUrl:
											'https://upload.wikimedia.org/wikipedia/ru/f/f4/Minecraft_Cover_Art.png',
									},
									{
										id: 5,
										name: "Assassin's Creed Valhalla",
										price: 1999,
										imageUrl:
											'https://upload.wikimedia.org/wikipedia/ru/thumb/2/26/AC_Valhalla_standard_edition.jpg/274px-AC_Valhalla_standard_edition.jpg',
									},
								]}
								categoryId={1}
							/>
							<ProductsGroupList
								title={'Экшен'}
								items={[
									{
										id: 1,
										name: 'The Witcher 3: Wild Hunt',
										price: 2499,
										imageUrl:
											'https://upload.wikimedia.org/wikipedia/ru/thumb/a/a2/The_Witcher_3-_Wild_Hunt_Cover.jpg/266px-The_Witcher_3-_Wild_Hunt_Cover.jpg',
									},
									{
										id: 2,
										name: 'Cyberpunk 2077',
										price: 2999,
										imageUrl:
											'https://upload.wikimedia.org/wikipedia/ru/thumb/b/bb/%D0%9E%D0%B1%D0%BB%D0%BE%D0%B6%D0%BA%D0%B0_%D0%BA%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%D0%BD%D0%BE%D0%B9_%D0%B8%D0%B3%D1%80%D1%8B_Cyberpunk_2077.jpg/274px-%D0%9E%D0%B1%D0%BB%D0%BE%D0%B6%D0%BA%D0%B0_%D0%BA%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%D0%BD%D0%BE%D0%B9_%D0%B8%D0%B3%D1%80%D1%8B_Cyberpunk_2077.jpg',
									},
									{
										id: 3,
										name: 'Red Dead Redemption 2',
										price: 2899,
										imageUrl:
											'https://upload.wikimedia.org/wikipedia/ru/thumb/0/03/Red_Dead_Redemption_2_coverart.jpg/220px-Red_Dead_Redemption_2_coverart.jpg',
									},
									{
										id: 4,
										name: 'Minecraft',
										price: 899,
										imageUrl:
											'https://upload.wikimedia.org/wikipedia/ru/f/f4/Minecraft_Cover_Art.png',
									},
									{
										id: 5,
										name: "Assassin's Creed Valhalla",
										price: 1999,
										imageUrl:
											'https://upload.wikimedia.org/wikipedia/ru/thumb/2/26/AC_Valhalla_standard_edition.jpg/274px-AC_Valhalla_standard_edition.jpg',
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
