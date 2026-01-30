import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Categories, Container, SortPopup } from '.';
import { Category } from '@prisma/client';

interface Props {
	categories: Category[];
	className?: string;
}

export const TopBar: React.FC<Props> = ({ categories, className }) => {
	return (
		<div
			className={cn(
				'sticky top-0 bg-white py-3 sm:py-5 shadow-lg shadow-black/5 z-10 overflow-x-auto -mx-4 sm:mx-0',
				className,
			)}>
			<Container className="flex items-center justify-between w-full sm:w-auto">
				<Categories items={categories} />
				<SortPopup />
			</Container>
		</div>
	);
};
