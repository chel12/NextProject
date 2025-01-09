'use client';
import {
	CheckoutItem,
	CheckoutItemDetails,
	Container,
	Title,
	WhiteBlock,
} from '@/shared/components/shared';
import { Button, Input, Textarea } from '@/shared/components/ui';
import { GameEdition, GameType } from '@/shared/constants/game';
import { useCart } from '@/shared/hooks';
import { getCartItemDetails } from '@/shared/lib';
import { ArrowRight, Package, Percent, Truck } from 'lucide-react';

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
					<WhiteBlock className="p-6 sticky top-4">
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
				</div>
			</div>
		</Container>
	);
}
