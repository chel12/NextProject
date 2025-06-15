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
// export interface Order {
// 	id: number;
// 	fullName: string;
// 	email: string;
// 	address: string;
// 	comment: string;
// 	totalAmount: number;
// 	status: string;
// 	items: string; // JSON string
// 	createdAt: string;
// }
import { Order, OrderStatus } from '@prisma/client';

export type OrderWithItems = Order & {
	items: OrderItem[];
};

export type OrderItem = {
	productItemId: number;
	productName: string;
	price: number;
	quantity: number;
	ingredients: {
		id: number;
		name: string;
		price: number;
	}[];
};
