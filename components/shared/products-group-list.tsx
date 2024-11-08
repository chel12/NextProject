import React from 'react';
import { Title } from '.';
import { ProductCard } from './product-card';
import { cn } from '@/lib/utils';

interface Props {
	title: string;
	items: any[];
	categoryId: number;
	className?: string;
	listClassName?: string;
}

export const ProductsGroupList: React.FC<Props> = ({
	title,
	items,
	categoryId,
	className,
	listClassName,
}) => {
	return (
		<div className={className}>
			<Title text={title} size="lg" className="font-extrabold mb-5" />
			<div className={cn('grid grid-cols-3 gap-[50px]', listClassName)}>
				{items.map((product, i) => (
					<ProductCard
						key={product.id}
						id={product.id}
						name={product.name}
						imageUrl={product.imageUrl}
						price={product.price}
					/>
				))}
			</div>
		</div>
	);
};
