import { cn } from '@/shared/lib/utils';

interface Props {
	src: string;
	className?: string;
}

export const CartItemDetailsImage: React.FC<Props> = ({ src, className }) => {
	return (
		<img
			className={cn(
				'w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] object-contain',
				className,
			)}
			src={src}
		/>
	);
};
