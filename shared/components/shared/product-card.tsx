import Link from 'next/link';
import React from 'react';
import { Title } from '.';
import { Button } from '../ui';
import { Plus } from 'lucide-react';
import { Ingredient } from '@prisma/client';
import { cn } from '@/shared/lib/utils';

interface Props {
	id: number;
	name: string;
	price: number;
	imageUrl: string;
	ingredients: Ingredient[];
	className?: string;
}

export const ProductCard: React.FC<Props> = ({
	id,
	name,
	price,
	imageUrl,
	ingredients,
	className,
}) => {
	return (
		<div className={cn(className, 'h-full flex flex-col w-full')}>
			<Link
				href={`/product/${id}`}
				className="block h-full flex flex-col w-full">
				<div className="flex justify-center p-4 sm:p-6 bg-secondary rounded-lg h-[180px] sm:h-[240px] flex-shrink-0">
					<img
						className="w-full h-full max-w-[120px] sm:max-w-[180px] object-contain rounded-[20px]"
						src={imageUrl}
						alt={name}
					/>
				</div>
				<Title text={name} size="sm" className="mb-1 mt-3 font-bold" />
				<p className="text-sm text-gray-400 min-h-[40px] line-clamp-2 overflow-hidden">
					{ingredients
						.map((ingredient) => ingredient.name)
						.join(', ')}
				</p>

				<div className="flex justify-between items-center mt-auto pt-4">
					<span className="text-[20px]">
						от <b>{price} Р</b>
					</span>
					<Button
						variant={'secondary'}
						className="text-base font-bold">
						<Plus size={20} className="mr-1"></Plus>
						Добавить
					</Button>
				</div>
			</Link>
		</div>
	);
};
