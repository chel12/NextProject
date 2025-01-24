'use client';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCart } from '@/shared/hooks';
import {
	CheckoutAdressForm,
	CheckoutCart,
	CheckoutPersonalForm,
	CheckoutSidebar,
	Container,
	Title,
} from '@/shared/components';
import {
	checkoutFormSchema,
	CheckoutFormValues,
} from '@/shared/constants/checkout-form-schema';
import { cn } from '@/shared/lib/utils';
import { createOrder } from '@/app/actions';

export default function CheckoutPage() {
	const { items, removeCartItem, totalAmount, updateItemQuantity, loading } =
		useCart();

	const form = useForm<CheckoutFormValues>({
		resolver: zodResolver(checkoutFormSchema),
		defaultValues: {
			email: '',
			firstName: '',
			lastName: '',
			phone: '',
			address: '',
			comment: '',
		},
	});
	const onSubmit = (data: CheckoutFormValues) => {
		console.log(data);
		createOrder(data);
	};

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
			<FormProvider {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex gap-10">
						{/* левый блок*/}
						<div className="flex flex-col gap-10 flex-1 mb-20">
							<CheckoutCart
								onClickCountButton={onClickCountButton}
								removeCartItem={removeCartItem}
								items={items}
								loading={loading}
							/>
							<CheckoutPersonalForm
								className={cn({
									'opacity-40 pointer-events-none': loading,
								})}
							/>
							<CheckoutAdressForm
								className={cn({
									'opacity-40 pointer-events-none': loading,
								})}
							/>
						</div>
						{/* правый блок*/}
						<div className="w-[450px]">
							<CheckoutSidebar
								totalAmount={totalAmount}
								loading={loading}
							/>
						</div>
					</div>
				</form>
			</FormProvider>
		</Container>
	);
}
