// utils/get-server-user.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '../constants/auth-options';

export async function getUserIdFromSession() {
	const session = await getServerSession(authOptions);
	return session?.user?.id ?? null;
}
