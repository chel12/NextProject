'use client';
import React from 'react';
import { cn } from '@/shared/lib/utils';
import { useRouter } from 'next/navigation';
import { ChooseProductForm } from '..';
import { ProductWithRelations } from '@/@types/prisma';
import { ChooseGameForm } from '../choose-game-form';
import { Dialog } from '../../ui';
import { DialogContent } from '../../ui/dialog';
import { useCartStore } from '@/shared/store';
import toast from 'react-hot-toast';

interface Props {
	product: ProductWithRelations;
	className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
	//для бека из модалки
	const router = useRouter();
	const isCrossPlatform = Boolean(product.items[0].gameType);

	//добавление как товара, так и игры.
	//из стора вытаскиваем
	const firstItem = product.items[0];
	const addCartItem = useCartStore((state) => state.addCartItem);
	const loading = useCartStore((state) => state.loading);

	// const onAddProduct = () => {
	// 	addCartItem({
	// 		productItemId: firstItem.id,
	// 	});
	// };
	// const onAddGame = (productItemId: number, ingredients: number[]) => {
	// 	try {
	// 		addCartItem({
	// 			productItemId,
	// 			ingredients,
	// 		});
	// 		toast.success('Игра добавлена в корзину');
	// 		router.back();
	// 	} catch (err) {
	// 		toast.error('Не удалось добавить игру в корзину');
	// 		console.error(err);
	// 	}
	// };

	const onSubmit = async (productItemId?: number, ingredients?: number[]) => {
		try {
			const itemId = productItemId ?? firstItem.id;
			await addCartItem({
				productItemId: itemId,
				ingredients,
			});
			toast.success(product.name + ' добавлен в корзину');
			router.back();
		} catch (error) {
			toast.error(`Не удалось ${product.name} добавить в корзину`);
			console.error(error);
		}
	};

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
							onSubmit={onSubmit}
							ingredients={product.ingredients}
							items={product.items}
							loading={loading}
						/>
					) : (
						<ChooseProductForm
							imageUrl={product.imageUrl}
							name={product.name}
							onSubmit={onSubmit}
							price={firstItem.price}
							loading={loading}
						/>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};
