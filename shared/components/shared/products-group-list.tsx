'use client';
import React, { useEffect } from 'react';
import { Title } from '.';
import { ProductCard } from './product-card';
import { useIntersection } from 'react-use';
import { cn } from '@/shared/lib/utils';
import { useCategoryStore } from '@/shared/store/category';
import { ProductWithRelations } from '@/@types/prisma';

interface Props {
	title: string;
	items: ProductWithRelations[];
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
	const setActiveCategoryId = useCategoryStore((state) => state.setActiveId);
	const intersectionRef = React.useRef(null);
	const intersection = useIntersection(intersectionRef, {
		threshold: 0.2,
	});
	useEffect(() => {
		if (intersection?.isIntersecting) {
			setActiveCategoryId(categoryId);
		}
	}, [categoryId, title, intersection?.isIntersecting]);

	return (
		<div
			className={cn(className, 'pb-20')}
			id={`category-${categoryId}`}
			ref={intersectionRef}>
			<Title text={title} size="lg" className="font-extrabold mb-5" />
			<div
				className={cn(
					'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-[30px] items-stretch auto-rows-fr',
					listClassName,
				)}>
				{items.map((product) => (
					<ProductCard
						key={product.id}
						id={product.id}
						name={product.name}
						imageUrl={product.imageUrl}
						price={product.items[0].price}
						ingredients={product.ingredients}
						className="h-[450px]"
					/>
				))}
			</div>
		</div>
	);
};
