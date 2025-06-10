'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Button, Input, Select } from '.';
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './ui/table';

type User = {
	id: number;
	fullName: string;
	email: string;
	password: string;
	role: 'USER' | 'ADMIN' | 'MANAGER';
	verified: string | null;
	provider: string | null;
	providerId: string | null;
	createdAt: string;
	updatedAt: string;
};

const initialForm: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
	fullName: '',
	email: '',
	password: '',
	role: 'USER',
	verified: null,
	provider: null,
	providerId: null,
};

export default function UserList() {
	const [users, setUsers] = useState<User[]>([]);
	const [form, setForm] = useState(initialForm);
	const [editingId, setEditingId] = useState<number | null>(null);

	const fetchUsers = async () => {
		const res = await fetch('/api/users');
		const data = await res.json();
		setUsers(data);
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async () => {
		if (editingId !== null) {
			await fetch('/api/users', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: editingId, ...form }),
			});
		} else {
			await fetch('/api/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});
		}
		setForm(initialForm);
		setEditingId(null);
		await fetchUsers();
	};

	const handleEdit = (user: User) => {
		setEditingId(user.id);
		setForm({
			fullName: user.fullName,
			email: user.email,
			password: user.password,
			role: user.role,
			verified: user.verified,
			provider: user.provider,
			providerId: user.providerId,
		});
	};

	const handleDelete = async (id: number) => {
		await fetch('/api/users', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id }),
		});
		await fetchUsers();
	};

	return (
		<div className="p-4 max-w-5xl mx-auto space-y-6">
			<Card>
				<CardContent className="pt-6 space-y-4">
					<h2 className="text-xl font-semibold">
						Создать / Редактировать пользователя
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
						<div>
							<Label htmlFor="fullName">Имя</Label>
							<Input
								id="fullName"
								name="fullName"
								value={form.fullName}
								onChange={handleChange}
							/>
						</div>
						<div>
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								value={form.email}
								onChange={handleChange}
							/>
						</div>
						<div>
							<Label htmlFor="password">Пароль</Label>
							<Input
								id="password"
								name="password"
								type="password"
								value={form.password}
								onChange={handleChange}
							/>
						</div>
						<div>
							<Label>Роль</Label>
							<Select
								value={form.role}
								onValueChange={(value) =>
									setForm((prev) => ({
										...prev,
										role: value as any,
									}))
								}>
								<SelectTrigger>
									<SelectValue placeholder="Выберите роль" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="USER">USER</SelectItem>
									<SelectItem value="ADMIN">ADMIN</SelectItem>
									<SelectItem value="MANAGER">
										MANAGER
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label htmlFor="provider">Provider</Label>
							<Input
								id="provider"
								name="provider"
								value={form.provider || ''}
								onChange={handleChange}
							/>
						</div>
						<div>
							<Label htmlFor="providerId">Provider ID</Label>
							<Input
								id="providerId"
								name="providerId"
								value={form.providerId || ''}
								onChange={handleChange}
							/>
						</div>
					</div>
					<Button onClick={handleSubmit}>
						{editingId
							? 'Обновить пользователя'
							: 'Создать пользователя'}
					</Button>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="pt-6">
					<h2 className="text-xl font-semibold mb-4">
						Список пользователей
					</h2>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Имя</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Роль</TableHead>
								<TableHead>Создан</TableHead>
								<TableHead className="text-right">
									Действия
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.map((user) => (
								<TableRow key={user.id}>
									<TableCell>{user.id}</TableCell>
									<TableCell>{user.fullName}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{user.role}</TableCell>
									<TableCell>
										{new Date(
											user.createdAt
										).toLocaleDateString()}
									</TableCell>
									<TableCell className="text-right space-x-2">
										<Button
											size="sm"
											onClick={() => handleEdit(user)}>
											Редактировать
										</Button>
										<Button
											variant="destructive"
											size="sm"
											onClick={() =>
												handleDelete(user.id)
											}>
											Удалить
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
