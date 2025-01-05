import { CartDTO } from '@/services/dto/cart.dto';
import { calcCartItemTotalPrice } from '.';

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
	disabled?: boolean;
	gamePlatform: number | null;
	gameType?: number | null;
	ingredients?: Array<{ name: string; price: number }>;
};

interface ReturnProps {
	items: CartStateItem[];
	totalAmount: number;
}
export const getCartDetails = (data: CartDTO): ReturnProps => {
	//items преобразуем, избавляем от вложенности
	const items = data.items.map((item) => ({
		id: item.id,
		quantity: item.quantity,
		name: item.productItem.product.name,
		imageUrl: item.productItem.product.imageUrl,
		price: calcCartItemTotalPrice(item),
		gamePlatform: item.productItem.platformType,
		gameType: item.productItem.gameType,
		disabled: false,
		ingredients: item.ingredients.map((ingredient) => ({
			name: ingredient.name,
			price: ingredient.price,
		})),
	})) as CartStateItem[];
	return { items, totalAmount: data.totalAmount };
};
