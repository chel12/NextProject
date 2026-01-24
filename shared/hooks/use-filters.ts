import { useSearchParams } from 'next/navigation';
import { useSet } from 'react-use';
import React from 'react';

interface PriceProps {
	priceFrom?: number;
	priceTo?: number;
}
interface QueryFilters extends PriceProps {
	gameTypes: string;
	platforms: string;
	ingredients: string;
}
export interface Filters {
	platforms: Set<string>;
	gameTypes: Set<string>;
	selectedIngredients: Set<string>;
	prices: PriceProps;
}
interface ReturnProps extends Filters {
	setPrices: (name: keyof PriceProps, value: number) => void;
	setGameType: (value: string) => void;
	setPlatform: (value: string) => void;
	setIngredients: (value: string) => void;
}

export const useFilters = (): ReturnProps => {
	//url и queryString

	const searchParams = useSearchParams() as unknown as Map<
		keyof QueryFilters,
		string
	>;
	/*Фильтр ингредиентов*/
	const [selectedIngredients, { toggle: toggleIngredients }] = useSet(
		new Set<string>(searchParams.get('ingredients')?.split(','))
	);
	/*Фильтр платформ*/
	const [platforms, { toggle: togglePlatform }] = useSet(
		new Set<string>(
			searchParams.has('platforms')
				? searchParams.get('platforms')?.split(',')
				: []
		)
	);
	/*Фильтр типов изданий*/
	const [gameTypes, { toggle: toggleGameType }] = useSet(
		new Set<string>(
			searchParams.has('gameTypes')
				? searchParams.get('gameTypes')?.split(',')
				: []
		)
	);
	/*Фильтр стоимости*/
	const [prices, setPrices] = React.useState<PriceProps>({
		priceFrom: Number(searchParams.get('priceFrom')) || undefined,
		priceTo: Number(searchParams.get('priceTo')) || undefined,
	});
	const updatePrice = (name: keyof PriceProps, value: number) => {
		setPrices((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return React.useMemo(
		() => ({
			platforms,
			gameTypes,
			prices,
			selectedIngredients,
			setPrices: updatePrice,
			setGameType: toggleGameType,
			setPlatform: togglePlatform,
			setIngredients: toggleIngredients,
		}),
		[platforms, gameTypes, prices, selectedIngredients, toggleGameType, togglePlatform, toggleIngredients]
	);
};
