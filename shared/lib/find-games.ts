import { prisma } from '@/prisma/prisma-client';
import { ingredients } from './../../prisma/constants';
export interface GetSearchParams {
	query?: string;
	sortBy?: string;
	platforms?: string;
	gameTypes?: string;
	ingredients?: string;
	priceFrom?: string;
	priceTo?: string;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000;

//получаем массивы параметров из урла
export const findGames = async (params: GetSearchParams) => {
	//url = http://localhost:3000/?priceTo=5000&platforms=3%2C1%2C2
	//из урла достаём, делаем массив, перебераем массив и делаем числом
	const platforms = params.platforms?.split(',').map(Number);
	const gameTypes = params.gameTypes?.split(',').map(Number);
	const ingredientsIdArr = params.ingredients?.split(',').map(Number);
	const minPrice = Number(params.priceFrom) || DEFAULT_MIN_PRICE;
	const maxPrice = Number(params.priceTo) || DEFAULT_MAX_PRICE;
	const categories = await prisma.category.findMany({
		include: {
			products: {
				orderBy: {
					id: 'desc',
				},
				where: {
					ingredients: ingredientsIdArr
						? {
								some: {
									id: {
										in: ingredientsIdArr,
									},
								},
						  }
						: undefined,
					items: {
						some: {
							platformType: {
								in: platforms,
							},
							gameType: {
								in: gameTypes,
							},
							price: {
								gte: minPrice,
								lte: maxPrice,
							},
						},
					},
				},
				include: {
					ingredients: true,
					items: {
						where: {
							price: {
								gte: minPrice,
								lte: maxPrice,
							},
						},
						orderBy: {
							price: 'asc',
						},
					},
				},
			},
		},
	});
	return categories;
};
