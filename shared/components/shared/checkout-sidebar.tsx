import React from 'react';
import { CheckoutItemDetails, WhiteBlock } from '.';
import { ArrowRight, Package, Percent, Truck } from 'lucide-react';
import { Button } from '../ui';
import { cn } from '@/shared/lib/utils';

interface Props {
	totalAmount: number;
	className?: string;
}

export const CheckoutSidebar: React.FC<Props> = ({
	totalAmount,

	className,
}) => {
	const DELIVERY_PRICE = Math.floor(totalAmount * 0.25);
	const VAT = Math.floor(totalAmount * 0.13);
	return (
		<WhiteBlock className={cn('p-6 sticky top-4', className)}>
			<div className="flex flex-col gap-1">
				<span className="text-xl">Итого: </span>
				<span className="text-[34px] font-extrabold">
					{totalAmount + VAT + DELIVERY_PRICE} Р.
				</span>
			</div>
			<CheckoutItemDetails
				title={
					<div className="flex items-center">
						<Package size={18} className="mr-2" />
						Стоимость товаров
					</div>
				}
				value={totalAmount}
			/>
			<CheckoutItemDetails
				title={
					<div className="flex items-center">
						<Percent size={18} className="mr-2" />
						Налоги
					</div>
				}
				value={VAT}
			/>
			<CheckoutItemDetails
				title={
					<div className="flex items-center">
						<Truck size={18} className="mr-2" />
						Доставка
					</div>
				}
				value={DELIVERY_PRICE}
			/>
			<Button
				type="submit"
				className="w-full h-14 rounded-2xl mt-6 text-base font-bold">
				Перейти к оплате
				<ArrowRight className="w-5 ml-2" />
			</Button>
		</WhiteBlock>
	);
};
