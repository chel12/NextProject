import React from 'react';

interface Props {
	code: string;
}

export const VerificationUser: React.FC<Readonly<Props>> = ({ code }) => (
	<div>
		<h1>Регистрация нового пользователя</h1>
		<p>
			Код подтверждения: <h2>{code}</h2>
		</p>
		<p>
			<a href={`http://localhost:3000/api/auth/verify?code=${code}`}>
				Подтвердить регистрацию
			</a>
		</p>
	</div>
);
