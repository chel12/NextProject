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
import toast from 'react-hot-toast';
import React from 'react';
import { useSession } from 'next-auth/react';
import { Api } from '@/shared/services/api-client';

export default function CheckoutPage() {
	const [submitting, setSubmitting] = React.useState(false);
	const { items, removeCartItem, totalAmount, updateItemQuantity, loading } =
		useCart();
	const { data: session } = useSession();

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

	React.useEffect(() => {
		async function fetchUserInfo() {
			try {
				const data = await Api.auth.getMe();
				const [firstName, lastName] = data.fullName.split(' ');

				form.setValue('email', data.email);
				form.setValue('firstName', firstName);
				form.setValue('lastName', lastName);
			} catch (error) {
				console.error('Ошибка получения данных пользователя:', error);
			}
		}

		if (session) {
			fetchUserInfo();
		}
	}, [form, session]);

	const onSubmit = async (data: CheckoutFormValues) => {
		try {
			setSubmitting(true);
			//url для перенаправления на оплату заказа
			const url = await createOrder(data);
			toast.success('Заказ успешно создан, переход на оплату...', {
				icon: '✅',
			});
			if (url) {
				location.href = url;
			}
		} catch (error) {
			console.log(error);
			setSubmitting(false);
			toast.error('Не удалось создать заказ', {
				icon: '⚠️',
			});
		}
	};

	//TODO: вынести эту функцию в useCart
	const onClickCountButton = (
		id: number,
		quantity: number,
		type: 'plus' | 'minus',
	) => {
		const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
		updateItemQuantity(id, newQuantity);
	};
	return (
		<Container className="mt-4 sm:mt-8">
			<Title
				className=" font-extrabold mb-4 sm:mb-8 text-2xl sm:text-[36px]"
				text="Оформление заказа"
			/>
			<FormProvider {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex flex-col lg:flex-row gap-5 lg:gap-10">
						{/* левый блок*/}
						<div className="flex flex-col gap-5 lg:gap-10 flex-1 mb-10 lg:mb-20">
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
						<div className="w-full lg:w-[450px] mt-5 lg:mt-0 order-first lg:order-last">
							<CheckoutSidebar
								totalAmount={totalAmount}
								loading={loading || submitting}
							/>
						</div>
					</div>
				</form>
			</FormProvider>
		</Container>
	);
}
