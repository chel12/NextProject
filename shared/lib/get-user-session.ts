import { getServerSession } from 'next-auth';
import { authOptions } from '../constants/auth-options';

//опции для получения сессии
export const getUserSession = async () => {
	const session = await getServerSession(authOptions);
	return session?.user ?? null;
};
