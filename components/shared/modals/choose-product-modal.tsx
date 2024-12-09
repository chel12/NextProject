'use client';
import React from 'react';
import { Dialog } from '@/components/ui';
import { Product } from '@prisma/client';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Title } from '../title';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Props {
	product: Product;
	className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
	//для бека из модалки
	const router = useRouter();
	return (
		<div>
			<Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
				<DialogContent
					className={cn(
						'p-0 w-[1060px] max-w-[1060px] min-h-[500px] bg-white overflow-hidden',
						className
					)}>
					<Title>{product.name}</Title>
				</DialogContent>
			</Dialog>
		</div>
	);
};
