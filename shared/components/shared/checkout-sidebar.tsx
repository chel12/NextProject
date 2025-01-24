import React from 'react';
import { CheckoutItemDetails, WhiteBlock } from '.';
import { ArrowRight, Package, Percent, Truck } from 'lucide-react';
import { Button, Skeleton } from '../ui';
import { cn } from '@/shared/lib/utils';

interface Props {
	loading?: boolean;
	totalAmount: number;
	className?: string;
}

export const CheckoutSidebar: React.FC<Props> = ({
	totalAmount,
	loading,
	className,
}) => {
	const DELIVERY_PRICE = Math.floor(totalAmount * 0.25);
	const VAT = Math.floor(totalAmount * 0.13);
	return (
		<WhiteBlock className={cn('p-6 sticky top-4', className)}>
			<div className="flex flex-col gap-1">
				<span className="text-xl">Итого: </span>
				{loading ? (
					<Skeleton className=" h-11 w-48" />
				) : (
					<span className=" h-11 text-[34px] font-extrabold">
						{totalAmount + VAT + DELIVERY_PRICE} Р.
					</span>
				)}
			</div>
			<CheckoutItemDetails
				title={
					<div className="flex items-center">
						<Package size={18} className="mr-2" />
						Стоимость товаров
					</div>
				}
				value={
					loading ? (
						<Skeleton className="h-6 w-14 rounded-[6px]" />
					) : (
						`${totalAmount} Руб.`
					)
				}
			/>
			<CheckoutItemDetails
				title={
					<div className="flex items-center">
						<Percent size={18} className="mr-2" />
						Налоги
					</div>
				}
				value={
					loading ? (
						<Skeleton className="h-6 w-14 rounded-[6px]" />
					) : (
						`${VAT} Руб.`
					)
				}
			/>
			<CheckoutItemDetails
				title={
					<div className="flex items-center">
						<Truck size={18} className="mr-2" />
						Доставка
					</div>
				}
				value={
					loading ? (
						<Skeleton className="h-6 w-14 rounded-[6px]" />
					) : (
						`${DELIVERY_PRICE} Руб.`
					)
				}
			/>
			<Button
				loading={loading}
				type="submit"
				className="w-full h-14 rounded-2xl mt-6 text-base font-bold">
				Перейти к оплате
				<ArrowRight className="w-5 ml-2" />
			</Button>
		</WhiteBlock>
	);
};
