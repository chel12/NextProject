'use client';
import React from 'react';
import { cn } from '@/shared/lib/utils';
import { useRouter } from 'next/navigation';
import { ChooseProductForm } from '..';
import { ProductWithRelations } from '@/@types/prisma';
import { ChooseGameForm } from '../choose-game-form';
import { Dialog } from '../../ui';
import { DialogContent } from '../../ui/dialog';

interface Props {
	product: ProductWithRelations;
	className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
	//для бека из модалки
	const router = useRouter();
	const isCrossPlatform = Boolean(product.items[0].gameType);
	return (
		<div>
			<Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
				<DialogContent
					className={cn(
						'p-0 w-[1060px] max-w-[1060px] min-h-[500px] bg-white overflow-hidden',
						className
					)}>
					{isCrossPlatform ? (
						<ChooseGameForm
							imageUrl={product.imageUrl}
							name={product.name}
							ingredients={product.ingredients}
							items={product.items}
						/>
					) : (
						<ChooseProductForm
							imageUrl={product.imageUrl}
							name={product.name}
						/>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};
