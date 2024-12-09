import { cn } from '@/lib/utils';
import React from 'react';
import { GameImage, Title } from '.';
import { Button } from '../ui';

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
	const textDetails = `${name} ${ingredients} ${items}`;
	const totalPrice = 1000;
	const size = 3;
	return (
		<div className={cn(className, 'flex flex-1')}>
			<GameImage imageUrl={imageUrl} size={size} />
			<div className="w-[490px] bg-[#F7F6F5] p-7">
				<Title text={name} size="md" className="font-extrabold mb-1" />
				<p className="text-gray-400">{textDetails}</p>
				<Button className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10">
					Добавить в корзину за {totalPrice} Р
				</Button>
			</div>
		</div>
	);
};
