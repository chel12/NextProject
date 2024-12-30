import { ingredients } from './../../prisma/constants';
import { gameType, gameEdition } from './../../shared/constants/game';
{
	/*
Типизация полного овтета корзины в CartDTO
*/
}
import {
	Cart,
	CartItem,
	Ingredient,
	Product,
	ProductItem,
} from '@prisma/client';

export type CartItemDTO = CartItem & {
	productItem: ProductItem & {
		product: Product;
	};
	ingredients: Ingredient[];
};
export interface CartDTO extends Cart {
	items: CartItemDTO[];
}

export interface CreateCartItemValues {
	productItemId: number;
	ingredients?: number[];
}
