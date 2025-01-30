import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { TFormLoginValues, formLoginSchema } from './schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput, Title } from '../../..';
import { Button } from '@/shared/components';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';

interface Props {
	onClose?: VoidFunction;
}

export const LoginForm: React.FC<Props> = ({ onClose }) => {
	const form = useForm<TFormLoginValues>({
		resolver: zodResolver(formLoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});
	const onSubmit = async (data: TFormLoginValues) => {
		try {
			const resp = await signIn('credentials', {
				...data,
				redirect: false,
			});

			if (!resp?.ok) {
				throw Error();
			}
			toast.success('Вы успешно вошли в аккаунт', {
				icon: '✅',
			});
			onClose?.();
		} catch (error) {
			console.error('Error [LOGIN]', error);
			toast.error('Не удалось войти в аккаунт', {
				icon: '❌',
			});
		}
	};

	return (
		<FormProvider {...form}>
			<form
				className="flex flex-col gap-5"
				onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex justify-between items-center">
					<div className="mr-2">
						<Title
							text="Вход в аккаунт"
							size="md"
							className="font-bold"
						/>
						<p className="text-gray-400">
							Введите свою почту, чтобы войти в свой аккаунт
						</p>
					</div>
					<img
						className="w-6 h-6"
						src="/assets/images/phone-icon.png"
					/>
				</div>

				<FormInput name="email" label="E-mail" required />
				<FormInput name="password" label="Пароль" required />

				<Button
					loading={form.formState.isSubmitting}
					className="h-12 text-base"
					type="submit">
					Войти
				</Button>
			</form>
		</FormProvider>
	);
};
