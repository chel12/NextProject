import { Ingredient } from '@prisma/client';
import { GameEdition, GameType, mapGameType } from '../constants/game';
import { CartStateItem } from './get-cart-details';

export const getCartItemDetails = (
	ingredients: CartStateItem['ingredients'],
	gameType: GameType,
	platformType: GameEdition
): string => {
	const details = [];
	{
		/* достаём названия и пушим в детейлс*/
	}
	if (platformType && gameType) {
		const typeName = mapGameType[gameType];
		details.push(`Тип носителя ${typeName} для ${platformType}`);
	}
	if (ingredients) {
		details.push(
			...ingredients.map(
				(ingredient) => `В набор входит: ${ingredient.name}`
			)
		);
	}
	return details.join(', ');
};
