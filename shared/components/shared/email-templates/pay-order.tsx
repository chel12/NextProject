import React from 'react';

interface Props {
	orderId: number;
	totalAmount: number;
	paymentUrl: string;
}

export const PayOrderTemplate: React.FC<Readonly<Props>> = ({
	orderId,
	totalAmount,
	paymentUrl,
}) => (
	<div>
		<h1>Заказ #{orderId} </h1>
		<p>
			Заказ сформирован и ждёт оплаты, сумма заказа: {totalAmount} Р.
			Перейдите <a href={paymentUrl}>Перейдите по этой ссылке</a> для
			оплаты заказа.
		</p>
	</div>
);
