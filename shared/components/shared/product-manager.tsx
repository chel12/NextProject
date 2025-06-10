'use client';
import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Category, Product, Ingredient } from '@prisma/client';
import { ProductWithRelations } from '@/@types/prisma';
import { gameEdition, gameType } from '@/shared/constants';


interface ProductFormData {
	id?: number;
	name: string;
	imageUrl: string;
	categoryName: string;
	items: Array<{
		id?: number;
		price: number;
		platformType?: number | null;
		gameType?: number | null;
	}>;
	ingredients: number[]; // ID выбранных ингредиентов
}

interface Pagination {
	currentPage: number;
	totalPages: number;
	pageSize: number;
	totalItems: number;
}

export default function ProductManager() {
	const router = useRouter();
	const [categories, setCategories] = useState<Category[]>([]);
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [products, setProducts] = useState<ProductWithRelations[]>([]);
	const [formData, setFormData] = useState<ProductFormData>({
		name: '',
		imageUrl: '',
		categoryName: '',
		items: [{ price: 0, platformType: undefined, gameType: undefined }],
		ingredients: [],
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [pagination, setPagination] = useState<Pagination>({
		currentPage: 1,
		totalPages: 1,
		pageSize: 10,
		totalItems: 0,
	});
	const [isEditing, setIsEditing] = useState(false);
	const [showForm, setShowForm] = useState(false);

	// Загрузка данных
	const fetchData = useCallback(async () => {
		try {
			// Загрузка категорий
			const categoriesRes = await fetch('/api/categories');
			const categoriesData = await categoriesRes.json();
			setCategories(categoriesData);

			// Загрузка ингредиентов
			const ingredientsRes = await fetch('/api/ingredients');
			const ingredientsData = await ingredientsRes.json();
			setIngredients(ingredientsData);

			// Загрузка продуктов с пагинацией
			const productsRes = await fetch(
				`/api/products?search=${searchTerm}&page=${pagination.currentPage}&pageSize=${pagination.pageSize}`
			);
			const { products: productsData, ...paginationData } =
				await productsRes.json();
			setProducts(productsData);
			setPagination(paginationData);
		} catch (error) {
			console.error('Ошибка загрузки данных:', error);
		}
	}, [searchTerm, pagination.currentPage, pagination.pageSize]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// Обработка изменений формы
	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Обработка изменений вариантов продукта
	const handleItemChange = (
		index: number,
		field: string,
		value: string | number | null
	) => {
		setFormData((prev) => {
			const newItems = [...prev.items];
			const parsedValue = value === null ? null : Number(value);
			newItems[index] = {
				...newItems[index],
				[field]: parsedValue === 0 ? undefined : parsedValue,
			};
			return { ...prev, items: newItems };
		});
	};

	// Обработка ингредиентов
	const handleIngredientChange = (ingredientId: number) => {
		setFormData((prev) => {
			const newIngredients = prev.ingredients.includes(ingredientId)
				? prev.ingredients.filter((id) => id !== ingredientId)
				: [...prev.ingredients, ingredientId];

			return { ...prev, ingredients: newIngredients };
		});
	};

	// Добавление нового варианта
	const addItem = () => {
		setFormData((prev) => ({
			...prev,
			items: [
				...prev.items,
				{ price: 0, platformType: undefined, gameType: undefined },
			],
		}));
	};

	// Удаление варианта
	const removeItem = (index: number) => {
		if (formData.items.length <= 1) return;
		setFormData((prev) => ({
			...prev,
			items: prev.items.filter((_, i) => i !== index),
		}));
	};

	// Редактирование продукта
	const handleEdit = (product: ProductWithRelations) => {
		setFormData({
			id: product.id,
			name: product.name,
			imageUrl: product.imageUrl,
			categoryName: product.category.name,
			items: product.items.map((item) => ({
				id: item.id,
				price: item.price,
				platformType: item.platformType ?? undefined,
				gameType: item.gameType ?? undefined,
			})),
			ingredients: product.ingredients.map((ing) => ing.id),
		});
		setIsEditing(true);
		setShowForm(true);
	};

	// Удаление продукта
	const handleDelete = async (productId: number) => {
		if (!confirm('Вы уверены, что хотите удалить этот продукт?')) return;

		try {
			const response = await fetch(`/api/products/${productId}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				fetchData();
				alert('Продукт успешно удален!');
			} else {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Ошибка удаления продукта');
			}
		} catch (error: any) {
			console.error(error);
			alert(error.message || 'Произошла ошибка');
		}
	};

	// Отправка формы
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const url = formData.id
				? `/api/products/${formData.id}`
				: '/api/products';

			const method = formData.id ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				fetchData();
				alert(
					`Продукт успешно ${formData.id ? 'обновлен' : 'создан'}!`
				);
				resetForm();
			} else {
				const errorData = await response.json();
				throw new Error(
					errorData.error || 'Ошибка сохранения продукта'
				);
			}
		} catch (error: any) {
			console.error(error);
			alert(error.message || 'Произошла ошибка');
		} finally {
			setIsSubmitting(false);
		}
	};

	// Сброс формы
	const resetForm = () => {
		setFormData({
			name: '',
			imageUrl: '',
			categoryName: '',
			items: [{ price: 0, platformType: undefined, gameType: undefined }],
			ingredients: [],
		});
		setIsEditing(false);
		setShowForm(false);
	};

	// Изменение страницы пагинации
	const handlePageChange = (page: number) => {
		setPagination((prev) => ({ ...prev, currentPage: page }));
	};

	return (
		<div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow">
			<h1 className="text-2xl font-bold mb-6">Управление продуктами</h1>

			{/* Поиск и кнопка добавления */}
			<div className="flex justify-between items-center mb-6">
				<div className="w-1/3">
					<input
						type="text"
						placeholder="Поиск продуктов..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full p-2 border rounded"
					/>
				</div>
				<button
					onClick={() => {
						resetForm();
						setShowForm(true);
					}}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
					+ Добавить продукт
				</button>
			</div>

			{/* Форма продукта */}
			{showForm && (
				<form
					onSubmit={handleSubmit}
					className="space-y-6 mb-8 p-4 border rounded-lg bg-gray-50">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-medium">
							{isEditing
								? 'Редактирование продукта'
								: 'Создание нового продукта'}
						</h2>
						<button
							type="button"
							onClick={resetForm}
							className="text-gray-500 hover:text-gray-700">
							× Закрыть
						</button>
					</div>

					{/* Название продукта */}
					<div>
						<label className="block mb-2 font-medium">
							Название продукта
						</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							className="w-full p-2 border rounded"
							required
							minLength={3}
						/>
					</div>

					{/* Ссылка на изображение */}
					<div>
						<label className="block mb-2 font-medium">
							Ссылка на изображение
						</label>
						<input
							type="url"
							name="imageUrl"
							value={formData.imageUrl}
							onChange={handleChange}
							className="w-full p-2 border rounded"
							placeholder="https://example.com/image.jpg"
							required
						/>
						{formData.imageUrl && (
							<div className="mt-4">
								<p className="mb-2 font-medium">
									Предпросмотр:
								</p>
								<img
									src={formData.imageUrl}
									alt="Превью изображения продукта"
									className="max-w-xs max-h-40 object-contain rounded border p-1"
									onError={(e) => {
										const target =
											e.target as HTMLImageElement;
										target.style.display = 'none';
									}}
								/>
							</div>
						)}
					</div>

					{/* Выбор категории */}
					<div>
						<label className="block mb-2 font-medium">
							Категория
						</label>
						<select
							name="categoryName"
							value={formData.categoryName}
							onChange={handleChange}
							className="w-full p-2 border rounded"
							required>
							<option value="">Выберите категорию</option>
							{categories.map((category) => (
								<option key={category.id} value={category.name}>
									{category.name}
								</option>
							))}
						</select>
					</div>

					{/* Выбор ингредиентов */}
					<div>
						<label className="block mb-2 font-medium">
							Ингредиенты
						</label>
						<div className="grid grid-cols-3 gap-2">
							{ingredients.map((ingredient) => (
								<div
									key={ingredient.id}
									className="flex items-center">
									<input
										type="checkbox"
										id={`ingredient-${ingredient.id}`}
										checked={formData.ingredients.includes(
											ingredient.id
										)}
										onChange={() =>
											handleIngredientChange(
												ingredient.id
											)
										}
										className="mr-2"
									/>
									<label
										htmlFor={`ingredient-${ingredient.id}`}>
										{ingredient.name} (+{ingredient.price}{' '}
										руб)
									</label>
								</div>
							))}
						</div>
					</div>

					{/* Варианты продукта */}
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<h2 className="text-xl font-medium">
								Варианты продукта
							</h2>
							<button
								type="button"
								onClick={addItem}
								className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
								+ Добавить вариант
							</button>
						</div>

						{formData.items.map((item, index) => (
							<div
								key={index}
								className="p-4 border rounded-lg space-y-3">
								<div className="flex justify-between">
									<h3 className="font-medium">
										Вариант #{index + 1}
									</h3>
									<button
										type="button"
										onClick={() => removeItem(index)}
										className="text-red-500 hover:text-red-700"
										disabled={formData.items.length <= 1}>
										Удалить
									</button>
								</div>

								<div>
									<label className="block mb-1">
										Цена (руб)
									</label>
									<input
										type="number"
										value={item.price}
										onChange={(e) =>
											handleItemChange(
												index,
												'price',
												e.target.value
											)
										}
										className="w-full p-2 border rounded"
										required
										min="0"
									/>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div>
										<label className="block mb-1">
											Тип платформы (опционально)
										</label>
										<select
											value={item.platformType ?? ''}
											onChange={(e) =>
												handleItemChange(
													index,
													'platformType',
													e.target.value || null
												)
											}
											className="w-full p-2 border rounded">
											<option value="">Не выбрано</option>
											{gameEdition.map((option) => (
												<option
													key={option.value}
													value={option.value}>
													{option.name}
												</option>
											))}
										</select>
									</div>
									<div>
										<label className="block mb-1">
											Тип игры (опционально)
										</label>
										<select
											value={item.gameType ?? ''}
											onChange={(e) =>
												handleItemChange(
													index,
													'gameType',
													e.target.value || null
												)
											}
											className="w-full p-2 border rounded">
											<option value="">Не выбрано</option>
											{gameType.map((option) => (
												<option
													key={option.value}
													value={option.value}>
													{option.name}
												</option>
											))}
										</select>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Кнопки формы */}
					<div className="flex gap-3">
						<button
							type="submit"
							disabled={isSubmitting}
							className={`px-6 py-2 text-white rounded font-medium ${
								isSubmitting
									? 'bg-gray-400 cursor-not-allowed'
									: 'bg-green-500 hover:bg-green-600'
							}`}>
							{isSubmitting ? 'Сохранение...' : 'Сохранить'}
						</button>
						<button
							type="button"
							onClick={resetForm}
							className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
							Отмена
						</button>
					</div>
				</form>
			)}

			{/* Таблица продуктов */}
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white border">
					<thead>
						<tr>
							<th className="py-2 px-4 border-b">ID</th>
							<th className="py-2 px-4 border-b">Название</th>
							<th className="py-2 px-4 border-b">Категория</th>
							<th className="py-2 px-4 border-b">Варианты</th>
							<th className="py-2 px-4 border-b">Ингредиенты</th>
							<th className="py-2 px-4 border-b">Действия</th>
						</tr>
					</thead>
					<tbody>
						{products.map((product) => (
							<tr key={product.id}>
								<td className="py-2 px-4 border-b">
									{product.id}
								</td>
								<td className="py-2 px-4 border-b">
									<div className="flex items-center">
										<img
											src={product.imageUrl}
											alt={product.name}
											className="w-12 h-12 object-cover rounded mr-3"
										/>
										{product.name}
									</div>
								</td>
								<td className="py-2 px-4 border-b">
									{product.category.name}
								</td>
								<td className="py-2 px-4 border-b">
									{product.items.map((item) => (
										<div key={item.id} className="mb-1">
											<div>Цена: {item.price} руб</div>
											{item.platformType && (
												<div>
													Платформа:{' '}
													{
														gameEdition.find(
															(e) =>
																e.value ===
																String(
																	item.platformType
																)
														)?.name
													}
												</div>
											)}
											{item.gameType && (
												<div>
													Тип:{' '}
													{
														gameType.find(
															(t) =>
																t.value ===
																String(
																	item.gameType
																)
														)?.name
													}
												</div>
											)}
										</div>
									))}
								</td>
								<td className="py-2 px-4 border-b">
									{product.ingredients
										.map((ing) => ing.name)
										.join(', ')}
								</td>
								<td className="py-2 px-4 border-b">
									<div className="flex gap-2">
										<button
											onClick={() => handleEdit(product)}
											className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
											Изменить
										</button>
										<button
											onClick={() =>
												handleDelete(product.id)
											}
											className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
											Удалить
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Пагинация */}
			{pagination.totalPages > 1 && (
				<div className="flex justify-center mt-6">
					<div className="flex gap-1">
						{Array.from(
							{ length: pagination.totalPages },
							(_, i) => i + 1
						).map((page) => (
							<button
								key={page}
								onClick={() => handlePageChange(page)}
								className={`px-3 py-1 rounded ${
									page === pagination.currentPage
										? 'bg-blue-500 text-white'
										: 'bg-gray-200 hover:bg-gray-300'
								}`}>
								{page}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
