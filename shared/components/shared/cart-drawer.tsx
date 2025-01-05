'use client';
import React from 'react';
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/shared/components/ui/sheet';
import Link from 'next/link';
import { Button } from '../ui';
import { ArrowRight } from 'lucide-react';
import { CartDrawerItem } from '.';
import { getCartItemDetails } from '@/shared/lib';
import { useCartStore } from '@/shared/store';
import { GameEdition, GameType } from '@/shared/constants/game';

interface Props {
	className?: string;
}

export const CartDrawer: React.FC<React.PropsWithChildren<Props>> = ({
	children,
}) => {
	const fetchCartItems = useCartStore((state) => state.fetchCartItems);
	const totalAmount = useCartStore((state) => state.totalAmount);
	const items = useCartStore((state) => state.items);
	const updateItemQuantity = useCartStore(
		(state) => state.updateItemQuantity
	);
	const removeCartItem = useCartStore((state) => state.removeCartItem);

	React.useEffect(() => {
		fetchCartItems();
	}, []);

	const onClickCountButton = (
		id: number,
		quantity: number,
		type: 'plus' | 'minus'
	) => {
		const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
		updateItemQuantity(id, newQuantity);
	};

	return (
		<Sheet>
			<SheetTrigger asChild>{children}</SheetTrigger>
			<SheetContent className="flex flex-col justify-between pb-0 bg-[#F4F1EE]">
				{/* TOP */}
				<SheetHeader>
					<SheetTitle>
						В корзине{' '}
						<span className="font-bold">{items.length} товара</span>
					</SheetTitle>
				</SheetHeader>
				{/* Mid items */}
				{/* 1 div для прижатия к топу + скролл*/}
				<div className="-mx-6 mt-5 overflow-auto  flex-1">
					{/* 2 div для отступа компонентов*/}

					{items.map((item) => (
						<div key={item.id} className="mb-2">
							<CartDrawerItem
								id={item.id}
								imageUrl={item.imageUrl}
								name={item.name}
								price={item.price}
								quantity={item.quantity}
								details={
									item.gamePlatform && item.gameType
										? getCartItemDetails(
												item.ingredients,
												item.gameType as GameType,
												item.gamePlatform as GameEdition
										  )
										: ''
								}
								disabled={item.disabled}
								onClickCountButton={(type) =>
									onClickCountButton(
										item.id,
										item.quantity,
										type
									)
								}
								onClickRemove={() => removeCartItem(item.id)}
							/>
						</div>
					))}
				</div>
				{/* BOTTOM */}
				<SheetFooter className="-mx-6 bg-white p-8">
					<div className="w-full">
						<div className="flex mb-4">
							<span className="flex flex-1 text-lg text-neutral-500">
								Итого
								<div className="flex-1 border-b border-dashed border-b-neutral-400 relative -top-1 mx-2" />
							</span>
							<span className="font-bold text-lg">
								{totalAmount} Р
							</span>
						</div>
						<Link href="/cart">
							<Button
								className="w-full h-12 text-base"
								type="submit">
								Оформить заказ
								<ArrowRight className="w-5 ml-2" />
							</Button>
						</Link>
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};
