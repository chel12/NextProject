import { Api } from '@/services/api-client';
import { create } from 'zustand';
import { getCartDetails } from '../lib';
import { CartStateItem } from '../lib/get-cart-details';

//на zustande


export interface CartState {
	loading: boolean;
	error: boolean;
	totalAmount: number;
	items: CartStateItem[];
	//получение товаров из корзине
	fetchCartItems: () => Promise<void>;
	//запрос на обновление количества товара в корзине
	updateItemQuantity: (id: number, quantity: number) => Promise<void>;
	//запрос на добавление товара в корзину
	addCartItem: (values: any) => Promise<void>;
	//запрос на удаление товара из корзины
	removeCartItem: (id: number) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
	items: [],
	error: false,
	loading: true,
	totalAmount: 0,
	fetchCartItems: async () => {
		try {
			set({ loading: true, error: false });
			const data = await Api.cart.fetchCart();
			set(getCartDetails(data));
		} catch (error) {
			console.error(error);
			set({ error: true });
		} finally {
			set({ loading: false });
		}
	},
	removeCartItem: async (id: number) => {},
	updateItemQuantity: async (id: number, quantity: number) => {},
	addCartItem: async (values: any) => {},
}));
