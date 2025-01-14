import { cn } from '@/shared/lib/utils';
import React from 'react';

interface Props {
	className?: string;
}

export const CheckoutItemSkeleton: React.FC<Props> = ({ className }) => {
	return (
		<div className={cn('flex items-center justify-between', className)}>
			<div className="flex items-center gap-5">
				<div className="w-[50px] h-[50px] bg-violet-100 rounded-full animate-pulse"></div>
				<h2 className="w-40 h-5 bg-violet-100 rounded animate-pulse"></h2>
			</div>
			<div className="h-5 w-10 bg-violet-100 rounded animate-pulse"></div>
			<div className="h-8 w-[133px] bg-violet-100 rounded animate-pulse"></div>
		</div>
	);
};
