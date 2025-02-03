'use client';
import React from 'react';
import { useCartStore } from '@/shared/store';
import toast from 'react-hot-toast';
import { ProductWithRelations } from '@/@types/prisma';
import { ChooseGameForm } from './choose-game-form';
import { ChooseProductForm } from './choose-product-form';

interface Props {
	product: ProductWithRelations;
	onSubmit?: VoidFunction;
}

export const ProductForm: React.FC<Props> = ({
	product,
	onSubmit: _onSubmit,
}) => {
	const addCartItem = useCartStore((state) => state.addCartItem);
	const loading = useCartStore((state) => state.loading);
	const firstItem = product.items[0];
	const isCrossPlatform = Boolean(firstItem.gameType);
	const onSubmit = async (productItemId?: number, ingredients?: number[]) => {
		try {
			const itemId = productItemId ?? firstItem.id;
			await addCartItem({
				productItemId: itemId,
				ingredients,
			});
			toast.success(product.name + ' добавлен в корзину');
			_onSubmit?.();
		} catch (error) {
			toast.error(`Не удалось ${product.name} добавить в корзину`);
			console.error(error);
		}
	};
	if (isCrossPlatform) {
		return (
			<ChooseGameForm
				imageUrl={product.imageUrl}
				name={product.name}
				onSubmit={onSubmit}
				ingredients={product.ingredients}
				items={product.items}
				loading={loading}
			/>
		);
	} else {
		return (
			<ChooseProductForm
				imageUrl={product.imageUrl}
				name={product.name}
				onSubmit={onSubmit}
				price={firstItem.price}
				loading={loading}
			/>
		);
	}
};
