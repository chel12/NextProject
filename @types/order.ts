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
import { Order, User, OrderStatus } from '@prisma/client';

export interface OrderWithUser extends Order {
	user: User | null;
}
