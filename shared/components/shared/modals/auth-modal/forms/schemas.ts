import { z } from 'zod';
//валидация ZOD
export const passwordSchema = z.string().min(4, {
	message: 'Введите корректный пароль',
});

export const formLoginSchema = z.object({
	email: z.string().email({ message: 'Введите корректную почту' }),
	password: passwordSchema,
});

export const formRegisterSchema = formLoginSchema
	.merge(
		z.object({
			fullName: z.string().min(2, {
				message: 'Имя должно содержать не менее 2-х символов',
			}),
			confirmPassword: passwordSchema,
		})
	)
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Пароли не совпадают',
		path: ['confirmPassword'],
	});

//типазция форм, infer - делает тип на основе схем
export type TFormLoginValues = z.infer<typeof formLoginSchema>;
export type TFormRegisterValues = z.infer<typeof formRegisterSchema>;
