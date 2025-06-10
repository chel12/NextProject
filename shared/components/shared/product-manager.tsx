'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@prisma/client';
import { gameEdition, gameType } from '@/shared/constants';

// Типы для вариантов выбора
interface Option {
	value: string;
	name: string;
}

interface ProductFormData {
	name: string;
	imageUrl: string;
	categoryName: string;
	items: Array<{
		id?: number;
		price: number;
		platformType?: number | null;
		gameType?: number | null;
	}>;
}

export default function ProductManager() {
	const router = useRouter();
	const [categories, setCategories] = useState<Category[]>([]);
	const [formData, setFormData] = useState<ProductFormData>({
		name: '',
		imageUrl: '',
		categoryName: '',
		items: [{ price: 0, platformType: undefined, gameType: undefined }],
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Загрузка категорий при монтировании
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch('/api/categories');
				const data = await response.json();
				setCategories(data);
			} catch (error) {
				console.error('Ошибка загрузки категорий:', error);
			}
		};
		fetchCategories();
	}, []);

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

			// Преобразуем значение в число, если оно не null
			const parsedValue = value === null ? null : Number(value);

			newItems[index] = {
				...newItems[index],
				[field]: parsedValue === 0 ? undefined : parsedValue,
			};

			return { ...prev, items: newItems };
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

	// Отправка формы
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const response = await fetch('/api/products', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				router.refresh();
				alert('Продукт успешно сохранен!');
				// Сброс формы
				setFormData({
					name: '',
					imageUrl: '',
					categoryName: '',
					items: [
						{
							price: 0,
							platformType: undefined,
							gameType: undefined,
						},
					],
				});
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

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
			<h1 className="text-2xl font-bold mb-6">Управление продуктами</h1>

			<form onSubmit={handleSubmit} className="space-y-6">
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
							<p className="mb-2 font-medium">Предпросмотр:</p>
							<img
								src={formData.imageUrl}
								alt="Превью изображения продукта"
								className="max-w-xs max-h-40 object-contain rounded border p-1"
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.style.display = 'none';
								}}
							/>
						</div>
					)}
				</div>

				{/* Выбор категории */}
				<div>
					<label className="block mb-2 font-medium">Категория</label>
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
								<label className="block mb-1">Цена (руб)</label>
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

				{/* Кнопка отправки */}
				<button
					type="submit"
					disabled={isSubmitting}
					className={`w-full py-3 text-white rounded font-medium ${
						isSubmitting
							? 'bg-gray-400 cursor-not-allowed'
							: 'bg-green-500 hover:bg-green-600'
					}`}>
					{isSubmitting ? 'Сохранение...' : 'Сохранить продукт'}
				</button>
			</form>
		</div>
	);
}
