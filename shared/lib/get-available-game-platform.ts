import { ProductItem } from '@prisma/client';
import { gameEdition, GameType } from '../constants/game';
import { Variant } from '../components/shared/group-variants';

export const getAvailableGamePlatforms = (
	type: GameType,
	items: ProductItem[]
): Variant[] => {
	/*Сначала отбираем по типу Издания*/
	const filteredGameByType = items.filter((item) => item.gameType == type);
	/*Потом отбираем по платформе*/
	return gameEdition.map((item) => ({
		name: item.name,
		value: item.value,
		disabled: !filteredGameByType.some(
			(game) => Number(game.platformType) == Number(item.value)
		),
	}));
};
