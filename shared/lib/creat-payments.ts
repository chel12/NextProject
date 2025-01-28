import { PaymentData } from '@/@types/yookassa';
import axios from 'axios';

interface Props {
	amount: number;
	description: string;
	orderId: number;
}

export async function createPayments(details: Props) {
	const { data } = await axios.post<PaymentData>(
		'https://api.yookassa.ru/v3/payments',
		{
			//цена
			amount: {
				value: details.amount,
				currency: 'RUB',
			},
			capture: true,
			//что заказал
			description: details.description,
			//!Какой именно заказ человек хочет оплатить
			metadata: {
				order_id: details.orderId,
			},
			//куда деректить после
			confirmation: {
				type: 'redirect',
				return_url: process.env.YOOKASSA_CALLBACK_URL,
			},
		},
		{
			//для юкассы ключ апи кабинета
			auth: {
				username: process.env.YOOKASSA_STORE_ID as string,
				password: process.env.YOOKASSA_API_KEY as string,
			},
			//заголовок для уникальности имени заказа
			headers: {
				'Content-Type': 'application/json',
				'Idempotence-Key': Math.random().toString(36).substring(7),
			},
		}
	);

	return data;
}
