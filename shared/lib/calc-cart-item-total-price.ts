import { CartItemDTO } from '@/services/dto/cart.dto';

/**
 *
 * @param item принимает вариацию товара, считает сумму ингредиентов и кол-во
 * @returns возвращет итоговую сумму вариации товара, + ингредиенты + кол-во
 */
export const calcCartItemTotalPrice = (item: CartItemDTO): number => {
	const ingredientsPrice = item.ingredients.reduce(
		(acc, ingredient) => acc + ingredient.price,
		0
	);
	return (ingredientsPrice + item.productItem.price) * item.quantity;
};
