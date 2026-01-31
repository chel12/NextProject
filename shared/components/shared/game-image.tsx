import { cn } from '@/shared/lib/utils';
import React from 'react';

interface Props {
	className?: string;
	imageUrl: string;
}

export const GameImage: React.FC<Props> = ({ imageUrl, className }) => {
	return (
		<div
			className={cn(
				'flex items-center justify-center flex-1 relative w-full',
				className,
			)}>
			<img
				src={imageUrl}
				alt="Icon"
				className={cn(
					'relative left-2 top-2 transition-all z-10 duration-300 rounded-full object-contain w-[200px] h-[200px] sm:w-[300px] sm:h-[300px]',
				)}
			/>
		</div>
	);
};
