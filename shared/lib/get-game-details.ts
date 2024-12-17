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
	platformType: GameEdition,
	items: ProductItem[],
	ingredients: Ingredient[],
	selectedIngredients: Set<number>
) => {
	const totalPrice = calcTotalGamePrices(
		type,
		platformType,
		items,
		ingredients,
		selectedIngredients
	);
	const textDetails = `Игра ${name} для ${mapGameEdition[platformType]} в издание ${mapGameType[type]}`;
	return { totalPrice, textDetails };
};
