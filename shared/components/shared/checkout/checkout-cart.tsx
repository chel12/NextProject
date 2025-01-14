import { getCartItemDetails } from '@/shared/lib';
import { CheckoutItem } from '../checkout-item';
import { WhiteBlock } from '../white-block';
import { GameEdition, GameType } from '@/shared/constants/game';
import { CartStateItem } from '@/shared/lib/get-cart-details';
import { CheckoutItemSkeleton } from '../..';

interface Props {
	items: CartStateItem[];
	onClickCountButton: (
		id: number,
		quantity: number,
		type: 'plus' | 'minus'
	) => void;
	removeCartItem: (id: number) => void;
	loading?: boolean;
	className?: string;
}
export const CheckoutCart: React.FC<Props> = ({
	items,
	onClickCountButton,
	removeCartItem,
	loading,
	className,
}) => {
	return (
		<WhiteBlock title="1. Корзина" className={className}>
			<div className="flex flex-col gap-5">
				{loading
					? [...Array(4)].map((_, index) => (
							<CheckoutItemSkeleton key={index} />
					  ))
					: items.map((item) => (
							<CheckoutItem
								key={item.id}
								id={item.id}
								disabled={item.disabled}
								imageUrl={item.imageUrl}
								name={item.name}
								price={item.price}
								quantity={item.quantity}
								details={getCartItemDetails(
									item.ingredients,
									item.gameType as GameType,
									item.gamePlatform as GameEdition
								)}
								onClickCountButton={(type) =>
									onClickCountButton(
										item.id,
										item.quantity,
										type
									)
								}
								onClickRemove={() => removeCartItem(item.id)}
							/>
					  ))}
			</div>
		</WhiteBlock>
	);
};
