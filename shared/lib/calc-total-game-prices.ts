import { Ingredient, ProductItem } from '@prisma/client';
import { GameEdition, GameType } from '../constants/game';

/**
 * Функкция для подсчета общей стоимости игры
 * @param type - тип издания выбранной игры
 * @param gamePlatform - тип платформы выбранной игры
 * @param items - список вариаций
 * @param ingredients - список ингредиентов
 * @param selectedIngredients  - выбранные ингредиенты
 *
 * @returns number общую стоимость
 */
export const calcTotalGamePrices = (
	type: GameType,
	gamePlatform: GameEdition,
	items: ProductItem[],
	ingredients: Ingredient[],
	selectedIngredients: Set<number>,
) => {
	/*прайс выбранных игр в зависимости от типа и платформы*/
	const gamePrice =
		items.find(
			(item) =>
				item.gameType == type && item.gamePlatform == gamePlatform,
		)?.price || 0;

	/*прайс за всё выбранные ингредиенты*/
	const totalIngredientsPrice = ingredients
		.filter((ingredient) => selectedIngredients.has(ingredient.id))
		.reduce((acc, ingredient) => acc + ingredient.price, 0);

	/*итоговый прайс: игра + доп. ингредиенты*/
	return gamePrice + totalIngredientsPrice;
};
