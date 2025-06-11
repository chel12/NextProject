// types/order.ts
import { Ingredient, Product, ProductItem } from '@prisma/client';

export type OrderItemDTO = {
	id: number;
	quantity: number;
	productItem: ProductItem & {
		product: Product;
	};
	ingredients: Ingredient[];
};
// types.ts
export interface Order {
	id: number;
	fullName: string;
	email: string;
	address: string;
	comment: string;
	totalAmount: number;
	status: string;
	items: string; // JSON string
	createdAt: string;
}
