import {
	Categories,
	Container,
	SortPopup,
	Title,
	TopBar,
} from '@/components/shared';

export default function Home() {
	return (
		<>
			<Container className="mt-10">
				<Title text="Все игры" size="lg" className="font-extrabold" />
			</Container>
			<TopBar />
			<Container className="pb-14">
				<div className="flex gap-[60px]">
					{/*Филтьтрация*/}
					<div className="w-[250px]">
						<Filters />
					</div>
				</div>
			</Container>
		</>
	);
}
