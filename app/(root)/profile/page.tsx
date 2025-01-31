
import { getUserSession } from '@/shared/lib/get-user-session';
import { redirect } from 'next/navigation';

//первым делом проверка авторизации, профиль видно только авторизованным
export default async function ProfilePage() {
	const session = await getUserSession();

	if (!session) {
		return redirect('/not-auth');
	}

	return <div>ЭТО ТВОЙ ПРОФИЛЬ</div>;
}
