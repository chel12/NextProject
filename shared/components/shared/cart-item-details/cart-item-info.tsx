import { cn } from '@/shared/lib/utils';

interface Props {
	name: string;
	details: string;
	className?: string;
}

export const CartItemInfo: React.FC<Props> = ({ name, details, className }) => {
	return (
		<div className="w-full">
			<div className={cn('flex items-start justify-between', className)}>
				<h2 className="text-base sm:text-lg font-bold flex-1 leading-5 sm:leading-6 break-words">
					{name}
				</h2>
			</div>
			{details && (
				<p className="text-xs sm:text-sm text-gray-400 w-full mt-1">
					{details}
				</p>
			)}
		</div>
	);
};
