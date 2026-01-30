import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Title } from '.';
import { Button } from '../ui';

interface Props {
	imageUrl: string;
	name: string;
	className?: string;
	onSubmit?: VoidFunction;
	price: number;
	loading?: boolean;
}
/**
 * Форма выбора продукта
 */
export const ChooseProductForm: React.FC<Props> = ({
	className,
	imageUrl,
	name,
	onSubmit,
	price,
	loading,
}) => {
	return (
		<div
			className={cn(
				className,
				'flex flex-col items-center overflow-y-auto max-h-screen lg:max-h-none',
			)}>
			<div className="flex items-center justify-center relative w-full p-4">
				<img
					src={imageUrl}
					alt={name}
					className="transition-all z-10 duration-300 w-full max-w-[250px] h-auto sm:max-w-[350px] sm:h-[350px]"
				/>
			</div>
			<div className="w-full max-w-[490px] bg-[#F7F6F5] p-4 lg:p-7 rounded-xl">
				<Title text={name} size="md" className="font-extrabold mb-1" />
				{/* <p className="text-gray-400">{textDetails}</p> */}
				<Button
					loading={loading}
					onClick={() => onSubmit?.()}
					className="h-[55px] px-10 text-base rounded-[18px] w-full mt-5 lg:mt-10">
					Добавить в корзину за {price} Р
				</Button>
			</div>
		</div>
	);
};
