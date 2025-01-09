'use client';
import React from 'react';
import Image from 'next/image';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/shared/components/ui/sheet';
import Link from 'next/link';
import { Button } from '../ui';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CartDrawerItem, Title } from '.';
import { getCartItemDetails } from '@/shared/lib';
import { GameEdition, GameType } from '@/shared/constants/game';
import { cn } from '@/shared/lib/utils';
import { useCart } from '@/shared/hooks';

export const CartDrawer: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	
	const { items, removeCartItem, totalAmount, updateItemQuantity } =
		useCart();
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
				{/* блок для центровки содержимого на всю высоту если !totalAmount*/}
				<div
					className={cn(
						'flex flex-col h-full',
						!totalAmount && 'justify-center'
					)}>
					{totalAmount > 0 && (
						<SheetHeader>
							{/* TOP */}
							<SheetTitle>
								В корзине{' '}
								<span className="font-bold">
									{items.length} товара
								</span>
							</SheetTitle>
						</SheetHeader>
					)}

					{!totalAmount && (
						<div className="flex flex-col items-center justify-center w-72 mx-auto">
							<Image
								src="/assets/images/box-emty.png"
								alt="Empty cart"
								width={120}
								height={120}
							/>
							<Title
								size="sm"
								text="Корзина пустая"
								className="text-center font-bold my-2"
							/>
							<p className="text-center text-neutral-500 mb-5">
								Вы ведь правда хотите добавить игру? :)
							</p>
							<SheetClose>
								<Button
									className="w-56 h-12 text-base"
									size="lg">
									<ArrowLeft className="w-5 mr-2" />
									Перейти назад
								</Button>
							</SheetClose>
						</div>
					)}

					{totalAmount > 0 && (
						<>
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
												item.gamePlatform &&
												item.gameType
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
											onClickRemove={() =>
												removeCartItem(item.id)
											}
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
						</>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
};
