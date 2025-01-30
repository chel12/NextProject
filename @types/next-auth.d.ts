import { UserRole } from '@prisma/client';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
	export interface Session {
		user: {
			id: string;
			role: UserRole;
			name: string;
			image: string;
		};
	}
	interface User extends DefaultUser {
		role: UserRole;
	}
}
declare module 'next-auth/jwt' {
	interface JWT extends DefaultJWT {
		id: string;
		role: UserRole;
	}
}
