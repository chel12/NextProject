import React from 'react';
import { FilterCheckbox, FilterCheckboxProps } from './filter-checkbox';
import { Input, Skeleton } from '../ui';

type Item = FilterCheckboxProps;
interface Props {
	title: string;
	items: Item[];
	defaultItems?: Item[];
	limit?: number;
	loading?: boolean;
	searchInputPlaceholder?: string;
	onClickCheckbox?: (id: string) => void;
	defaultValue?: string[];
	selected?: Set<string>;
	className?: string;
	name?: string;
}
export const CheckboxFiltersGroup: React.FC<Props> = ({
	name,
	title,
	items,
	defaultItems,
	limit = 8,
	loading,
	searchInputPlaceholder = 'Поиск...',
	className,
	onClickCheckbox,
	selected,
}) => {
	const [showAll, setShowAll] = React.useState(false);
	const [searchValue, setSearchValue] = React.useState('');

	const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	{
		/* скелетон для чекбокс фильтра*/
	}
	if (loading) {
		return (
			<div className={className}>
				<p className="font-bold mb-3">{title}</p>
				{...Array(limit)
					.fill(0)
					.map((_, index) => (
						<Skeleton
							className="h-6 mb-4 rounded-[8px]"
							key={index}
						/>
					))}
				<Skeleton className="w-28 h-6 mb-4 rounded-[8px]" />
			</div>
		);
	}

	{
		/* показать ещё ингредиенты*/
	}
	const list = showAll
		? items.filter((item) =>
				item.text.toLowerCase().includes(searchValue.toLowerCase())
		  )
		: (defaultItems || items).slice(0, limit);

	return (
		<div className={className}>
			<p className="font-bold mb-3">{title}</p>
			{showAll && (
				<div className="mb-5">
					<Input
						onChange={onChangeSearchInput}
						placeholder={searchInputPlaceholder}
						className="bg-gray-50 border-none"
					/>
				</div>
			)}

			<div className="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar">
				{list.map((item, index) => (
					<FilterCheckbox
						name={name}
						key={index}
						text={item.text}
						value={item.value}
						endAdornment={item.endAdornment}
						checked={selected?.has(item.value)}
						onCheckedChange={() => onClickCheckbox?.(item.value)}
					/>
				))}
			</div>
			{items.length > limit && (
				<div
					className={
						showAll ? 'border-t border-t-neutral-100 mt-4' : ''
					}>
					<button
						onClick={() => setShowAll(!showAll)}
						className="text-primary mt-3">
						{showAll ? 'Скрыть' : '+ Показать все'}
					</button>
				</div>
			)}
		</div>
	);
};