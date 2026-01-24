import { GameEdition, GameType, mapGameType } from '../constants/game';
import { CartStateItem } from './get-cart-details';

export const getCartItemDetails = (
	ingredients: CartStateItem['ingredients'],
	gameType?: GameType,
	gamePlatform?: GameEdition,
): string => {
	const details = [];
	{
		/* достаём названия и пушим в детейлс*/
	}
	if (gamePlatform && gameType) {
		const typeName = mapGameType[gameType];
		details.push(`Тип носителя ${typeName} для ${gamePlatform}`);
	}
	if (ingredients) {
		details.push(
			...ingredients.map(
				(ingredient) => `В набор входит: ${ingredient.name}`,
			),
		);
	}
	return details.join(', ');
};
