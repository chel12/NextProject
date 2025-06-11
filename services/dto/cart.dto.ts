
import {
	Cart,
	CartItem,
	Ingredient,
	Product,
	ProductItem,
} from '@prisma/client';

//DTO - интерфейс взаимодействующий с бекендом, либо отправка, либо получение
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
