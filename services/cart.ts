import { axiosInstance } from './instance';
import { CartDTO } from './dto/cart.dto';

//запросы на сервер, где контроллеры будут выполнять обработку и возврат
//запрос получения корзины, Cart = овтет от сервера
export const getCart = async (): Promise<CartDTO> => {
	return (await axiosInstance.get<CartDTO>('/cart')).data;
};

export const updateItemQuantity = async (
	itemId: number,
	quantity: number
): Promise<CartDTO> => {
	return (
		await axiosInstance.patch<CartDTO>('/cart/' + itemId, {
			quantity,
		})
	).data;
};

export const removeCartItem = async (id: number): Promise<CartDTO> => {
	return (await axiosInstance.delete<CartDTO>('/cart/' + id)).data;
};
