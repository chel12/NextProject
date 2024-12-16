import { cn } from '@/shared/lib/utils';
import React from 'react';
import { GameImage, IngredientItem, Title } from '.';
import { Button } from '../ui';
import { GroupVariants } from './group-variants';
import {
	GameEdition,
	GameType,
	gameEdition,
	gameType,
} from '@/shared/constants/game';
import { Ingredient } from '@prisma/client';

interface Props {
	imageUrl: string;
	name: string;
	className?: string;
	ingredients: Ingredient[];
	items?: any;
	onClickAdd?: VoidFunction;
}

export const ChooseGameForm: React.FC<Props> = ({
	className,
	imageUrl,
	ingredients,
	name,
	items,
	onClickAdd,
}) => {
	const [edition, setEdition] = React.useState<GameEdition>(1);
	const [type, setType] = React.useState<GameType>(1);
	const textDetails = `${name} ${ingredients} ${items}`;
	const totalPrice = 1000;

	return (
		<div className={cn(className, 'flex flex-1')}>
			<GameImage imageUrl={imageUrl} size={edition} />
			<div className="w-[490px] bg-[#F7F6F5] p-7">
				<Title text={name} size="md" className="font-extrabold mb-1" />
				<p className="text-gray-400">{textDetails}</p>
				<div className="flex flex-col gap-4 mt-5">
					<GroupVariants
						items={gameEdition}
						value={String(edition)}
						onClick={(value) =>
							setEdition(Number(value) as GameEdition)
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
								onClick={onClickAdd}
							/>
						))}
					</div>
				</div>
				<Button className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10">
					Добавить в корзину за {totalPrice} Р
				</Button>
			</div>
		</div>
	);
};
