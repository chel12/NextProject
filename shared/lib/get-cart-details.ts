import { Cart } from '@prisma/client';
{
	/*
CartStateItem типизация в нужном формате корзины для UI
*/
}
export type CartStateItem = {
	id: number;
	quantity: number;
	name: string;
	imageUrl: string;
	price: number;
	gamePlatform: number | null;
	type?: number | null;
	ingredients?: Array<{ name: string; price: number }>;
};

interface ReturnProps {
	items: CartStateItem[];
	totalAmount: number;
}
export const getCartDetails = (data: Cart) => {
	return;
};
