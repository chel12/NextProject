'use client';
import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Category, Product, Ingredient } from '@prisma/client';
import { ProductWithRelations } from '@/@types/prisma';
import { gameEdition, gameType } from '@/shared/constants';
import { useToast } from '@/shared/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
	Button,
	Checkbox,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Input,
	Select,
} from '..';
import { Label } from '../ui/label';
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '../ui/pagination';

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
	ingredients: number[];
}

interface Pagination {
	currentPage: number;
	totalPages: number;
	pageSize: number;
	totalItems: number;
}

export default function ProductManager() {
	const router = useRouter();
	const { toast } = useToast();
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
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const fetchData = useCallback(async () => {
		try {
			const [categoriesRes, ingredientsRes, productsRes] =
				await Promise.all([
					fetch('/api/categories'),
					fetch('/api/ingredients'),
					fetch(
						`/api/products?search=${searchTerm}&page=${pagination.currentPage}&pageSize=${pagination.pageSize}`
					),
				]);

			const categoriesData = await categoriesRes.json();
			const ingredientsData = await ingredientsRes.json();
			const productsResponse = await productsRes.json();

			setCategories(categoriesData);
			setIngredients(ingredientsData);
			setProducts(productsResponse.products);
			setPagination({
				currentPage: productsResponse.currentPage,
				totalPages: productsResponse.totalPages,
				pageSize: productsResponse.pageSize,
				totalItems: productsResponse.totalItems,
			});
		} catch (error) {
			toast({
				title: 'Ошибка загрузки данных',
				description: 'Не удалось загрузить данные',
				variant: 'destructive',
			});
		}
	}, [searchTerm, pagination.currentPage, pagination.pageSize, toast]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

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

	const handleIngredientChange = (ingredientId: number) => {
		setFormData((prev) => {
			const newIngredients = prev.ingredients.includes(ingredientId)
				? prev.ingredients.filter((id) => id !== ingredientId)
				: [...prev.ingredients, ingredientId];
			return { ...prev, ingredients: newIngredients };
		});
	};

	const addItem = () => {
		setFormData((prev) => ({
			...prev,
			items: [
				...prev.items,
				{ price: 0, platformType: undefined, gameType: undefined },
			],
		}));
	};

	const removeItem = (index: number) => {
		if (formData.items.length <= 1) return;
		setFormData((prev) => ({
			...prev,
			items: prev.items.filter((_, i) => i !== index),
		}));
	};

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
		setIsDialogOpen(true);
	};

	const handleDelete = async (productId: number) => {
		if (!confirm('Вы уверены, что хотите удалить этот продукт?')) return;

		try {
			const response = await fetch(`/api/products/${productId}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				fetchData();
				toast({
					title: 'Продукт удален',
					description: 'Продукт успешно удален',
				});
			} else {
				throw new Error('Ошибка удаления продукта');
			}
		} catch (error) {
			toast({
				title: 'Ошибка',
				description: 'Не удалось удалить продукт',
				variant: 'destructive',
			});
		}
	};

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
				toast({
					title: 'Успешно',
					description: `Продукт успешно ${
						formData.id ? 'обновлен' : 'создан'
					}`,
				});
				setIsDialogOpen(false);
				resetForm();
			} else {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Ошибка сохранения');
			}
		} catch (error: any) {
			toast({
				title: 'Ошибка',
				description: error.message || 'Произошла ошибка',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetForm = () => {
		setFormData({
			name: '',
			imageUrl: '',
			categoryName: '',
			items: [{ price: 0, platformType: undefined, gameType: undefined }],
			ingredients: [],
		});
		setIsEditing(false);
	};

	const handlePageChange = (page: number) => {
		setPagination((prev) => ({ ...prev, currentPage: page }));
	};

	return (
		<div className="max-w-6xl mx-auto p-6">
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Управление продуктами</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex justify-between items-center mb-6">
						<div className="w-1/3">
							<Input
								placeholder="Поиск продуктов..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<Dialog
							open={isDialogOpen}
							onOpenChange={setIsDialogOpen}>
							<DialogTrigger asChild>
								<Button
									onClick={() => {
										resetForm();
										setIsEditing(false);
									}}>
									+ Добавить продукт
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
								<DialogHeader>
									<DialogTitle>
										{isEditing
											? 'Редактирование продукта'
											: 'Создание нового продукта'}
									</DialogTitle>
								</DialogHeader>
								<form
									onSubmit={handleSubmit}
									className="space-y-6">
									<div>
										<Label htmlFor="name">
											Название продукта
										</Label>
										<Input
											id="name"
											name="name"
											value={formData.name}
											onChange={handleChange}
											required
											minLength={3}
										/>
									</div>

									<div>
										<Label htmlFor="imageUrl">
											Ссылка на изображение
										</Label>
										<Input
											id="imageUrl"
											name="imageUrl"
											value={formData.imageUrl}
											onChange={handleChange}
											placeholder="https://example.com/image.jpg"
											required
										/>
										{formData.imageUrl && (
											<div className="mt-4">
												<Label>Предпросмотр:</Label>
												<img
													src={formData.imageUrl}
													alt="Превью изображения продукта"
													className="mt-2 max-w-xs max-h-40 object-contain rounded border p-1"
													onError={(e) => {
														const target =
															e.target as HTMLImageElement;
														target.style.display =
															'none';
													}}
												/>
											</div>
										)}
									</div>

									<div>
										<Label>Категория</Label>
										<Select
											value={formData.categoryName}
											onValueChange={(value) =>
												setFormData((prev) => ({
													...prev,
													categoryName: value,
												}))
											}
											required>
											<SelectTrigger>
												<SelectValue placeholder="Выберите категорию" />
											</SelectTrigger>
											<SelectContent>
												{categories.map((category) => (
													<SelectItem
														key={category.id}
														value={category.name}>
														{category.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label>Ингредиенты</Label>
										<div className="grid grid-cols-3 gap-2 mt-2">
											{ingredients.map((ingredient) => (
												<div
													key={ingredient.id}
													className="flex items-center space-x-2">
													<Checkbox
														id={`ingredient-${ingredient.id}`}
														checked={formData.ingredients.includes(
															ingredient.id
														)}
														onCheckedChange={() =>
															handleIngredientChange(
																ingredient.id
															)
														}
													/>
													<label
														htmlFor={`ingredient-${ingredient.id}`}
														className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
														{ingredient.name} (+
														{ingredient.price} руб)
													</label>
												</div>
											))}
										</div>
									</div>

									<div className="space-y-4">
										<div className="flex justify-between items-center">
											<Label className="text-lg">
												Варианты продукта
											</Label>
											<Button
												type="button"
												onClick={addItem}
												variant="outline">
												+ Добавить вариант
											</Button>
										</div>

										{formData.items.map((item, index) => (
											<Card key={index} className="p-4">
												<div className="flex justify-between mb-3">
													<Label className="font-medium">
														Вариант #{index + 1}
													</Label>
													<Button
														type="button"
														onClick={() =>
															removeItem(index)
														}
														variant="destructive"
														size="sm"
														disabled={
															formData.items
																.length <= 1
														}>
														Удалить
													</Button>
												</div>

												<div className="mb-3">
													<Label>Цена (руб)</Label>
													<Input
														type="number"
														value={item.price}
														onChange={(e) =>
															handleItemChange(
																index,
																'price',
																e.target.value
															)
														}
														required
														min="0"
													/>
												</div>

												<div className="grid grid-cols-2 gap-4">
													<div>
														<Label>
															Тип платформы
															(опционально)
														</Label>
														<Select
															value={
																item.platformType?.toString() ||
																''
															}
															onValueChange={(
																value
															) =>
																handleItemChange(
																	index,
																	'platformType',
																	value ||
																		null
																)
															}>
															<SelectTrigger>
																<SelectValue placeholder="Не выбрано" />
															</SelectTrigger>
															<SelectContent>
																{gameEdition.map(
																	(
																		option
																	) => (
																		<SelectItem
																			key={
																				option.value
																			}
																			value={option.value.toString()}>
																			{
																				option.name
																			}
																		</SelectItem>
																	)
																)}
															</SelectContent>
														</Select>
													</div>
													<div>
														<Label>
															Тип игры
															(опционально)
														</Label>
														<Select
															value={
																item.gameType?.toString() ||
																''
															}
															onValueChange={(
																value
															) =>
																handleItemChange(
																	index,
																	'gameType',
																	value ||
																		null
																)
															}>
															<SelectTrigger>
																<SelectValue placeholder="Не выбрано" />
															</SelectTrigger>
															<SelectContent>
																{gameType.map(
																	(
																		option
																	) => (
																		<SelectItem
																			key={
																				option.value
																			}
																			value={option.value.toString()}>
																			{
																				option.name
																			}
																		</SelectItem>
																	)
																)}
															</SelectContent>
														</Select>
													</div>
												</div>
											</Card>
										))}
									</div>

									<DialogFooter>
										<Button
											type="submit"
											disabled={isSubmitting}>
											{isSubmitting
												? 'Сохранение...'
												: 'Сохранить'}
										</Button>
										<Button
											type="button"
											variant="outline"
											onClick={() =>
												setIsDialogOpen(false)
											}>
											Отмена
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>
					</div>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Название</TableHead>
								<TableHead>Категория</TableHead>
								<TableHead>Варианты</TableHead>
								<TableHead>Ингредиенты</TableHead>
								<TableHead>Действия</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{products.map((product) => (
								<TableRow key={product.id}>
									<TableCell>{product.id}</TableCell>
									<TableCell>
										<div className="flex items-center">
											<img
												src={product.imageUrl}
												alt={product.name}
												className="w-12 h-12 object-cover rounded mr-3"
											/>
											{product.name}
										</div>
									</TableCell>
									<TableCell>
										<Badge variant="outline">
											{product.category.name}
										</Badge>
									</TableCell>
									<TableCell>
										<div className="space-y-1">
											{product.items.map((item) => (
												<div
													key={item.id}
													className="text-sm">
													<div>
														Цена: {item.price} руб
													</div>
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
										</div>
									</TableCell>
									<TableCell>
										<div className="flex flex-wrap gap-1">
											{product.ingredients.map((ing) => (
												<Badge
													key={ing.id}
													variant="secondary">
													{ing.name}
												</Badge>
											))}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex gap-2">
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													handleEdit(product)
												}>
												Изменить
											</Button>
											<Button
												size="sm"
												variant="destructive"
												onClick={() =>
													handleDelete(product.id)
												}>
												Удалить
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					{pagination.totalPages > 1 && (
						<Pagination className="mt-6">
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										onClick={() =>
											handlePageChange(
												Math.max(
													1,
													pagination.currentPage - 1
												)
											)
										}
										isActive={pagination.currentPage > 1}
									/>
								</PaginationItem>

								{Array.from(
									{ length: pagination.totalPages },
									(_, i) => i + 1
								).map((page) => (
									<PaginationItem key={page}>
										<PaginationLink
											isActive={
												page === pagination.currentPage
											}
											onClick={() =>
												handlePageChange(page)
											}>
											{page}
										</PaginationLink>
									</PaginationItem>
								))}

								<PaginationItem>
									<PaginationNext
										onClick={() =>
											handlePageChange(
												Math.min(
													pagination.totalPages,
													pagination.currentPage + 1
												)
											)
										}
										isActive={
											pagination.currentPage <
											pagination.totalPages
										}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
