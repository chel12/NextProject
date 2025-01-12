'use client';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckoutSidebar, Container, Title } from '@/shared/components/shared';
import { useCart } from '@/shared/hooks';

import {
	CheckoutAdressForm,
	CheckoutCart,
	CheckoutPersonalForm,
} from '@/shared/components/shared/checkout';

export default function CheckoutPage() {
	const { items, removeCartItem, totalAmount, updateItemQuantity } =
		useCart();

	const form = useForm({
		resolver: zodResolver(),
		defaultValues: {
			email: '',
			firstName: '',
			lastName: '',
			phone: '',
			address: '',
			comment: '',
		},
	});
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
					<CheckoutCart
						onClickCountButton={onClickCountButton}
						removeCartItem={removeCartItem}
						items={items}
					/>
					<CheckoutPersonalForm />
					<CheckoutAdressForm />
				</div>
				{/* правый блок*/}
				<div className="w-[450px]">
					<CheckoutSidebar totalAmount={totalAmount} />
				</div>
			</div>
		</Container>
	);
}
