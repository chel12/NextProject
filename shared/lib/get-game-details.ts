import { Ingredient, ProductItem } from '@prisma/client';
import { calcTotalGamePrices } from './calc-total-game-prices';
import {
	GameEdition,
	GameType,
	mapGameEdition,
	mapGameType,
} from '../constants/game';

export const getGameDetails = (
	type: GameType,
	gamePlatform: GameEdition,
	items: ProductItem[],
	ingredients: Ingredient[],
	selectedIngredients: Set<number>,
) => {
	const totalPrice = calcTotalGamePrices(
		type,
		gamePlatform,
		items,
		ingredients,
		selectedIngredients,
	);
	const textDetails = `Игра ${name} для ${mapGameEdition[gamePlatform]} в издание ${mapGameType[type]}`;
	return { totalPrice, textDetails };
};
