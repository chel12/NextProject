import React from 'react';
import { Title } from '.';
import { FilterCheckbox } from './filter-checkbox';
import { Input, RangeSlider } from '../ui';
import { CheckboxFiltersGroup } from './checkbox-filters-group';

interface Props {
	className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
	return (
		<div className={className}>
			<Title text="Фильтрация" size="sm" className="mb-5 font-bold" />
			{/*Верхние чекбоксы*/}
			<div className="flex flex-col gap-4">
				<FilterCheckbox text="можно собрать" value="1" />
				<FilterCheckbox text="Новинки" value="2" />
			</div>
			{/*Фильтр цен*/}
			<div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
				<p className="font-bold mb-3">Цена от и до:</p>
				<div className="flex gap-3 mb-5">
					<Input
						type="number"
						placeholder="0"
						min={0}
						max={10000}
						defaultValue={0}
					/>
					<Input
						type="number"
						min={500}
						max={10000}
						placeholder="10000"
					/>
				</div>
				<RangeSlider min={0} max={5000} step={10} value={[0, 5000]} />
			</div>
			{/* Содержимое*/}
			<CheckboxFiltersGroup
				title="Ингредиенты"
				className="mt-5"
				limit={6}
				defaultItems={[
					{ text: 'Например 1', value: '1' },
					{ text: 'Например 2', value: '2' },
					{ text: 'Например 3', value: '3' },
					{ text: 'Например 4', value: '4' },
					{ text: 'Например 5', value: '5' },
					{ text: 'Например 6', value: '6' },
					{ text: 'Например 7', value: '7' },
					{ text: 'Например 8', value: '8' },
				]}
				items={[
					{ text: 'Например 1', value: '1' },
					{ text: 'Например 2', value: '2' },
					{ text: 'Например 3', value: '3' },
					{ text: 'Например 4', value: '4' },
					{ text: 'Например 5', value: '5' },
					{ text: 'Например 6', value: '6' },
					{ text: 'Например 7', value: '7' },
					{ text: 'Например 8', value: '8' },
				]}
			/>
		</div>
	);
};
