'use client';
import React, { useEffect } from 'react';
import { Title } from '.';
import { Input, RangeSlider } from '../ui';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { useFilterIngredients } from '@/hooks/useFilterIngredients';
import { useSet } from 'react-use';
import qs from 'qs';
import { useRouter, useSearchParams } from 'next/navigation';

interface PriceProps {
	priceFrom?: number;
	priceTo?: number;
}
interface Props {
	className?: string;
}
interface QueryFilters extends PriceProps {
	gameTypes: string;
	platforms: string;
	ingredients: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
	const searchParams = useSearchParams() as unknown as Map<
		keyof QueryFilters,
		string
	>;
	const router = useRouter();
	const [prices, setPrice] = React.useState<PriceProps>({
		priceFrom: Number(searchParams.get('priceFrom')) || undefined,
		priceTo: Number(searchParams.get('priceTo')) || undefined,
	});

	const [platforms, { toggle: togglePlatform }] = useSet(
		new Set<string>(
			searchParams.has('platforms')
				? searchParams.get('platforms')?.split(',')
				: []
		)
	);
	const [gameTypes, { toggle: toggleGameType }] = useSet(
		new Set<string>(
			searchParams.has('gameTypes')
				? searchParams.get('gameTypes')?.split(',')
				: []
		)
	);

	const { ingredients, loading, onAddId, selectedIngredients } =
		useFilterIngredients(searchParams.get('ingredients')?.split(','));

	const items = ingredients.map((item) => ({
		value: String(item.id),
		text: item.name,
	}));
	const updatePrice = (name: keyof PriceProps, value: number) => {
		setPrice({
			...prices,
			[name]: value,
		});
	};

	useEffect(() => {
		const filters = {
			...prices,
			gameTypes: Array.from(gameTypes),
			platforms: Array.from(platforms),
			ingredients: Array.from(selectedIngredients),
		};
		const query = qs.stringify(filters, { arrayFormat: 'comma' });
		router.push(`?${query}`, {
			scroll: false,
		});
	}, [platforms, gameTypes, selectedIngredients, prices, router]);

	return (
		<div className={className}>
			<Title text="Фильтрация" size="sm" className="mb-5 font-bold" />
			{/*Верхние чекбоксы*/}
			<div className="flex flex-col gap-4">
				{/* <FilterCheckbox name="onebox" text="можно собрать" value="1" />
				<FilterCheckbox name="twobox" text="Новинки" value="2" /> */}
			</div>
			<CheckboxFiltersGroup
				name="Платформы"
				title="Платформы"
				className="mb-5"
				onClickCheckbox={togglePlatform}
				selected={platforms}
				items={[
					{ text: 'PC', value: '1' },
					{ text: 'PS4', value: '2' },
					{ text: 'PS5', value: '3' },
				]}
			/>
			<CheckboxFiltersGroup
				title="Издания"
				name="Издания"
				className="mb-5"
				onClickCheckbox={toggleGameType}
				selected={gameTypes}
				items={[
					{ text: 'Цифровые', value: '1' },
					{ text: 'На диске', value: '2' },
				]}
			/>
			{/*Фильтр цен*/}
			<div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
				<p className="font-bold mb-3">Цена от и до:</p>
				<div className="flex gap-3 mb-5">
					<Input
						type="number"
						placeholder="0"
						min={0}
						max={5000}
						value={String(prices.priceFrom)}
						onChange={(e) =>
							updatePrice('priceFrom', Number(e.target.value))
						}
					/>
					<Input
						type="number"
						min={500}
						max={5000}
						placeholder="5000"
						value={String(prices.priceTo)}
						onChange={(e) =>
							updatePrice('priceTo', Number(e.target.value))
						}
					/>
				</div>
				<RangeSlider
					min={0}
					max={5000}
					step={10}
					value={[prices.priceFrom || 0, prices.priceTo || 5000]}
					onValueChange={([priceFrom, priceTo]) =>
						setPrice({ priceFrom, priceTo })
					}
				/>
			</div>
			{/* Содержимое*/}
			<CheckboxFiltersGroup
				name="Ингредиенты"
				title="Ингредиенты"
				className="mt-5"
				limit={4}
				defaultItems={items.slice(0, 4)}
				items={items}
				loading={loading}
				onClickCheckbox={onAddId}
				selected={selectedIngredients}
			/>
		</div>
	);
};
