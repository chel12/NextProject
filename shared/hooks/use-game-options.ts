import { GameEdition, GameType } from '../constants/game';
import React from 'react';
import { Variant } from '../components/shared/group-variants';
import { useSet } from 'react-use';
import { getAvailableGamePlatforms } from '../lib';
import { ProductItem } from '@prisma/client';

interface ReturnProps {
	platformType: GameEdition;
	type: GameType;
	setPlatformType: (platformType: GameEdition) => void;
	setType: (type: GameType) => void;
	selectedIngredients: Set<number>;
	availableTypes: Variant[];
	addIngredient: (id: number) => void;
}

export const useGameOptions = (items: ProductItem[]): ReturnProps => {
	const [platformType, setPlatformType] = React.useState<GameEdition>(1);
	const [type, setType] = React.useState<GameType>(1);
	const [selectedIngredients, { toggle: addIngredient }] = useSet(
		new Set<number>([])
	);
	const availableTypes = getAvailableGamePlatforms(type, items);
	//проверка изданияи типов его, покажет первое доступное
	React.useEffect(() => {
		const isAvailablePlatform = availableTypes?.find(
			(item) => Number(item.value) == platformType && !item.disabled
		);
		const availablePlatform = availableTypes?.find(
			(item) => !item.disabled
		);
		if (!isAvailablePlatform && availablePlatform) {
			setPlatformType(Number(availablePlatform.value) as GameEdition);
		}
	}, [type]);
	return {
		availableTypes,
		platformType,
		type,
		setPlatformType,
		setType,
		selectedIngredients,
		addIngredient,
	};
};
