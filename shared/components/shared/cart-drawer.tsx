'use client';
import React from 'react';
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
import { ArrowRight } from 'lucide-react';
import { CartDrawerItem } from '.';
import { getCartItemDetails } from '@/shared/lib';

interface Props {
	className?: string;
}

export const CartDrawer: React.FC<React.PropsWithChildren<Props>> = ({
	children,
	className,
}) => {
	return (
		<Sheet>
			<SheetTrigger asChild>{children}</SheetTrigger>
			<SheetContent className="flex flex-col justify-between pb-0 bg-[#F4F1EE]">
				{/* TOP */}
				<SheetHeader>
					<SheetTitle>
						В корзине <span className="font-bold">3 товара</span>
					</SheetTitle>
				</SheetHeader>
				{/* Mid items */}
				{/* 1 div для прижатия к топу + скролл*/}
				<div className="-mx-6 mt-5 overflow-auto  flex-1">
					{/* 2 div для отступа компонентов*/}
					<div className="mb-2">
						<CartDrawerItem
							details={getCartItemDetails(2, 1, [
								{ name: 'test' },
								{ name: 'test2' },
								{ name: 'test' },
							])}
							id={1}
							imageUrl={
								'https://gaming-cdn.com/images/products/1620/orig/call-of-duty-4-modern-warfare-pc-mac-game-steam-cover.jpg?v=1701179820'
							}
							name="test"
							price={1000}
							quantity={2}
						/>
					</div>
					<div className="mb-2">
						<CartDrawerItem
							details={getCartItemDetails(2, 1, [
								{ name: 'test' },
								{ name: 'test2' },
								{ name: 'test' },
							])}
							id={1}
							imageUrl={
								'https://gaming-cdn.com/images/products/1620/orig/call-of-duty-4-modern-warfare-pc-mac-game-steam-cover.jpg?v=1701179820'
							}
							name="test"
							price={1000}
							quantity={2}
						/>
					</div>
					<div className="mb-2">
						<CartDrawerItem
							details={getCartItemDetails(2, 1, [
								{ name: 'test' },
								{ name: 'test2' },
								{ name: 'test' },
							])}
							id={1}
							imageUrl={
								'https://gaming-cdn.com/images/products/1620/orig/call-of-duty-4-modern-warfare-pc-mac-game-steam-cover.jpg?v=1701179820'
							}
							name="test"
							price={1000}
							quantity={2}
						/>
					</div>
					<div className="mb-2">
						<CartDrawerItem
							details={getCartItemDetails(2, 1, [
								{ name: 'test' },
								{ name: 'test2' },
								{ name: 'test' },
							])}
							id={1}
							imageUrl={
								'https://gaming-cdn.com/images/products/1620/orig/call-of-duty-4-modern-warfare-pc-mac-game-steam-cover.jpg?v=1701179820'
							}
							name="test"
							price={1000}
							quantity={2}
						/>
					</div>
					<div className="mb-2">
						<CartDrawerItem
							details={getCartItemDetails(2, 1, [
								{ name: 'test' },
								{ name: 'test2' },
								{ name: 'test' },
							])}
							id={1}
							imageUrl={
								'https://gaming-cdn.com/images/products/1620/orig/call-of-duty-4-modern-warfare-pc-mac-game-steam-cover.jpg?v=1701179820'
							}
							name="test"
							price={1000}
							quantity={2}
						/>
					</div>
					<div className="mb-2">
						<CartDrawerItem
							details={getCartItemDetails(2, 1, [
								{ name: 'test' },
								{ name: 'test2' },
								{ name: 'test' },
							])}
							id={1}
							imageUrl={
								'https://gaming-cdn.com/images/products/1620/orig/call-of-duty-4-modern-warfare-pc-mac-game-steam-cover.jpg?v=1701179820'
							}
							name="test"
							price={1000}
							quantity={2}
						/>
					</div>
				</div>
				{/* BOTTOM */}
				<SheetFooter className="-mx-6 bg-white p-8">
					<div className="w-full">
						<div className="flex mb-4">
							<span className="flex flex-1 text-lg text-neutral-500">
								Итого
								<div className="flex-1 border-b border-dashed border-b-neutral-400 relative -top-1 mx-2" />
							</span>
							<span className="font-bold text-lg">0 Р</span>
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
