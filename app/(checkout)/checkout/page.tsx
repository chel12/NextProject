'use client';
import {
	CheckoutItem,
	CheckoutSidebar,
	Container,
	Title,
	WhiteBlock,
} from '@/shared/components/shared';
import { Input, Textarea } from '@/shared/components/ui';
import { GameEdition, GameType } from '@/shared/constants/game';
import { useCart } from '@/shared/hooks';
import { getCartItemDetails } from '@/shared/lib';

export default function CheckoutPage() {
	const { items, removeCartItem, totalAmount, updateItemQuantity } =
		useCart();
	const DELIVERY_PRICE = Math.floor(totalAmount * 0.25);
	const VAT = Math.floor(totalAmount * 0.13);
	//TODO: вынести эту функцию в useCart
	const onClickCountButton = (
		id: number,
		quantity: number,
		type: 'plus' | 'minus'
	) => {
		const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
		updateItemQuantity(id, newQuantity);
	};
	return (
		<Container className="mt-8">
			<Title
				className=" font-extrabold mb-8 text-[36px]"
				text="Оформление заказа"
			/>
			<div className="flex gap-10">
				{/* левый блок*/}
				<div className="flex flex-col gap-10 flex-1 mb-20">
					<WhiteBlock title="1. Корзина">
						<div className="flex flex-col gap-5">
							{items.map((item) => (
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
									onClickRemove={() =>
										removeCartItem(item.id)
									}
								/>
							))}
						</div>
					</WhiteBlock>
					<WhiteBlock title="2. Персональные данные">
						<div className="grid grid-cols-2 gap-5">
							<Input
								name="firstName"
								className="text-base"
								placeholder="Имя"></Input>
							<Input
								name="lastName"
								className="text-base"
								placeholder="Фамилия"></Input>
							<Input
								name="email"
								className="text-base"
								placeholder="E-Mail"></Input>
							<Input
								name="phone"
								className="text-base"
								placeholder="Телефон"></Input>
						</div>
					</WhiteBlock>
					<WhiteBlock title="3. Адрес доставки">
						<div className="flex flex-col gap-5">
							<Input
								name="firstName"
								className="text-base"
								placeholder="Адрес доставки"></Input>
							<Textarea
								className="text-base"
								rows={5}
								placeholder="Комментарий к заказу"
							/>
						</div>
					</WhiteBlock>
				</div>
				{/* правый блок*/}
				<div className="w-[450px]">
					<CheckoutSidebar
						DELIVERY_PRICE={DELIVERY_PRICE}
						VAT={VAT}
						totalAmount={totalAmount}
					/>
				</div>
			</div>
		</Container>
	);
}
