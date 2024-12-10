'use client';
import React from 'react';
import { Title } from '.';
import { Input, RangeSlider } from '../ui';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { useFilters, useIngredients, useQueryFilters } from '@/shared/hooks';
interface Props {
	className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
	const { ingredients, loading } = useIngredients();
	const filters = useFilters();
	useQueryFilters(filters);
	const items = ingredients.map((item) => ({
		value: String(item.id),
		text: item.name,
	}));
	const updatePrices = (prices: number[]) => {
		filters.setPrices('priceFrom', prices[0]);
		filters.setPrices('priceTo', prices[1]);
	};
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
				onClickCheckbox={filters.setPlatform}
				selected={filters.platforms}
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
				onClickCheckbox={filters.setGameType}
				selected={filters.gameTypes}
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
						value={String(filters.prices.priceFrom)}
						onChange={(e) =>
							filters.setPrices(
								'priceFrom',
								Number(e.target.value)
							)
						}
					/>
					<Input
						type="number"
						min={500}
						max={5000}
						placeholder="5000"
						value={String(filters.prices.priceTo)}
						onChange={(e) =>
							filters.setPrices('priceTo', Number(e.target.value))
						}
					/>
				</div>
				<RangeSlider
					min={0}
					max={5000}
					step={10}
					value={[
						filters.prices.priceFrom || 0,
						filters.prices.priceTo || 5000,
					]}
					onValueChange={updatePrices}
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
				onClickCheckbox={filters.setIngredients}
				selected={filters.selectedIngredients}
			/>
		</div>
	);
};
