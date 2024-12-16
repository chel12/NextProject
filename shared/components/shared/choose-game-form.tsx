import { cn } from '@/shared/lib/utils';
import React from 'react';
import { GameImage, Title } from '.';
import { Button } from '../ui';
import { GroupVariants } from './group-variants';
import {
	GameEdition,
	GameType,
	gameEdition,
	gameType,
} from '@/shared/constants/game';

interface Props {
	imageUrl: string;
	name: string;
	className?: string;
	ingredients: any;
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
				<Button className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10">
					Добавить в корзину за {totalPrice} Р
				</Button>
			</div>
		</div>
	);
};
