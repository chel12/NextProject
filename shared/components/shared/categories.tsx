'use client';
import { cn } from '@/shared/lib/utils';
import { useCategoryStore } from '@/shared/store/category';
import { Category } from '@prisma/client';
import React from 'react';

interface Props {
	items: Category[];
	className?: string;
}

export const Categories: React.FC<Props> = ({ items, className }) => {
	const categoryActiveId = useCategoryStore((state) => state.activeId);
	return (
		<div
			className={cn(
				'flex flex-wrap gap-1 bg-gray-50 p-1 rounded-2xl',
				className,
			)}>
			{items.map(({ name, id }, index) => (
				<button
					type="button"
					onClick={() => {
						const element = document.getElementById(
							`category-${id}`,
						);
						if (element) {
							const offsetTop = element.offsetTop - 150; // Учитываем высоту шапки
							window.scrollTo({
								top: offsetTop,
								behavior: 'smooth',
							});
						}
					}}
					className={cn(
						'flex items-center font-bold h-10 sm:h-11 rounded-xl sm:rounded-2xl px-3 sm:px-5',
						categoryActiveId == id &&
							'bg-white shadow-md shadow-gray-200 text-primary',
					)}
					key={index}>
					{name}
				</button>
			))}
		</div>
	);
};
