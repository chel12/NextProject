import React from 'react';
import { cn } from '../../lib/utils';
import { Title } from '.';

interface Props {
	title?: string;
	endAdornment?: React.ReactNode;
	contentClassName?: string;
	className?: string;
	onClick?: () => void;
}

export const WhiteBlock: React.FC<React.PropsWithChildren<Props>> = ({
	title,
	endAdornment,
	className,
	contentClassName,
	children,
	onClick,
}) => {
	return (
		<div
			className={cn('bg-white rounded-xl sm:rounded-3xl', className)}
			onClick={onClick}>
			{title && (
				<div className="flex items-center justify-between p-3 sm:p-5 sm:px-7 border-b border-gray-100">
					<Title text={title} size="sm" className="font-bold" />
					{endAdornment}
				</div>
			)}
			<div className={cn('px-5 py-4', contentClassName)}>{children}</div>
		</div>
	);
};
