import { cn } from '@/shared/lib/utils';
import React from 'react';
import { GameImage, IngredientItem, Title } from '.';
import { Button } from '../ui';
import { GroupVariants } from './group-variants';
import { GameEdition, GameType, gameType } from '@/shared/constants/game';
import { Ingredient, ProductItem } from '@prisma/client';

import { useGameOptions } from '@/shared/hooks';
import { getGameDetails } from '@/shared/lib';

interface Props {
	imageUrl: string;
	name: string;
	className?: string;
	ingredients: Ingredient[];
	items: ProductItem[];
	onClickAddCart?: VoidFunction;
}

export const ChooseGameForm: React.FC<Props> = ({
	className,
	imageUrl,
	ingredients,
	name,
	items,
	onClickAddCart,
}) => {
	const {
		platformType,
		type,
		selectedIngredients,
		availableTypes,
		setType,
		setPlatformType,
		addIngredient,
	} = useGameOptions(items);

	const { textDetails, totalPrice } = getGameDetails(
		type,
		platformType,
		items,
		ingredients,
		selectedIngredients
	);
	const handleClickAdd = () => {
		onClickAddCart?.();
		console.log({ type, platformType });
	};

	return (
		<div className={cn(className, 'flex flex-1')}>
			<GameImage imageUrl={imageUrl} size={platformType} />
			<div className="w-[490px] bg-[#F7F6F5] p-7">
				<Title text={name} size="md" className="font-extrabold mb-1" />
				<p className="text-gray-400">{textDetails}</p>
				<div className="flex flex-col gap-4 mt-5">
					<GroupVariants
						items={availableTypes}
						value={String(platformType)}
						onClick={(value) =>
							setPlatformType(Number(value) as GameEdition)
						}
					/>
					<GroupVariants
						items={gameType}
						value={String(type)}
						onClick={(value) => setType(Number(value) as GameType)}
					/>
				</div>
				{/*div для скролла в ингредиентах(scrollbar кастом класс из
				global css)*/}
				<div className="bg-gray-50 p-5 rounded-md h-[420px] overflow-auto scrollbar mt-5">
					<div className="grid grid-cols-3 gap-3">
						{ingredients.map((ingredient) => (
							<IngredientItem
								key={ingredient.id}
								name={ingredient.name}
								price={ingredient.price}
								imageUrl={ingredient.ImageUrl}
								onClick={() => addIngredient(ingredient.id)}
								active={selectedIngredients.has(ingredient.id)}
							/>
						))}
					</div>
				</div>
				<Button
					onClick={handleClickAdd}
					className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10">
					Добавить в корзину за {totalPrice}Р
				</Button>
			</div>
		</div>
	);
};
