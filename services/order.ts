// services/order.ts
import axios from 'axios';

export const order = {
	async getMyOrders() {
		const res = await axios.get('/api/orders/my');
		return res.data; // ← убедись, что здесь возвращаются данные, а не `null`/`undefined`
	},
};
