import { Container, Filters, Title, TopBar } from '@/components/shared';
import { ProductCard } from '@/components/shared/product-card';

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
							Cписок товаров
							<ProductCard
								id={0}
								name="azaza"
								price={0}
								imageUrl="https://img.freepik.com/premium-vector/cat-kitten-image_1138544-190058.jpg"
							/>
						</div>
					</div>
				</div>
			</Container>
		</>
	);
}
