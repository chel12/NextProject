import { cn } from '@/shared/lib/utils';
import React from 'react';

interface Props {
	className?: string;
	imageUrl: string;
	size: 1 | 2 | 3;
}

export const GameImage: React.FC<Props> = ({ imageUrl, size, className }) => {
	return (
		<div
			className={cn(
				'flex items-center justify-center flex-1 relative w-full',
				className
			)}>
			<img
				src={imageUrl}
				alt="Icon"
				className={cn(
					'relative left-2 top-2 transition-all z-10 duration-300 rounded-full',
					{
						'w-[300px] h-[300px]': size === 1,
						'w-[400px] h-[400px]': size === 2,
						'w-[500px] h-[500px]': size === 3,
					}
				)}
			/>
		</div>
	);
};
