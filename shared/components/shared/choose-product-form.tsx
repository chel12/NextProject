import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Title } from '.';
import { Button } from '../ui';

interface Props {
	imageUrl: string;
	name: string;
	className?: string;
	onClickAdd?: VoidFunction;
}

export const ChooseProductForm: React.FC<Props> = ({
	className,
	imageUrl,
	name,
	onClickAdd,
}) => {
	const textDetails = `la la zaglushka`;
	const totalPrice = 1000;
	return (
		<div className={cn(className, 'flex flex-1')}>
			<div className="flex items-center justify-center flex-1 relative w-full">
				<img
					src={imageUrl}
					alt={name}
					className="relative left-2 top-2 transition-all z-10 duration-300 w-[350px] h-[350px]"
				/>
			</div>
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