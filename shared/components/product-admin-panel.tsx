'use client';

import { ProductWithRelations } from '@/@types/prisma';
import { Ingredient } from '@prisma/client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button, Checkbox, Input } from '.';

export default function ProductAdminPanel() {
	const [products, setProducts] = useState<ProductWithRelations[]>([]);
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [selectedIngredientIds, setSelectedIngredientIds] = useState<
		number[]
	>([]);

	const [newProduct, setNewProduct] = useState({
		name: '',
		imageUrl: '',
		categoryId: 1,
	});

	useEffect(() => {
		fetch('/api/products')
			.then((res) => res.json())
			.then(setProducts);

		fetch('/api/ingredients')
			.then((res) => res.json())
			.then(setIngredients);
	}, []);

	const handleToggleIngredient = (id: number) => {
		setSelectedIngredientIds((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
		);
	};

	const handleAddProduct = async () => {
		const res = await fetch('/api/products', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				...newProduct,
				ingredientIds: selectedIngredientIds,
			}),
		});
		const created = await res.json();
		setProducts((prev) => [...prev, created]);
		setNewProduct({ name: '', imageUrl: '', categoryId: 1 });
		setSelectedIngredientIds([]);
	};

	return (
		<div className="grid gap-6 p-6">
			<Card>
				<CardContent className="grid gap-4">
					<h2 className="text-lg font-semibold">Add Product</h2>
					<Input
						placeholder="Product Name"
						value={newProduct.name}
						onChange={(e) =>
							setNewProduct({
								...newProduct,
								name: e.target.value,
							})
						}
					/>
					<Input
						placeholder="Image URL"
						value={newProduct.imageUrl}
						onChange={(e) =>
							setNewProduct({
								...newProduct,
								imageUrl: e.target.value,
							})
						}
					/>
					<Input
						type="number"
						placeholder="Category ID"
						value={newProduct.categoryId}
						onChange={(e) =>
							setNewProduct({
								...newProduct,
								categoryId: parseInt(e.target.value),
							})
						}
					/>
					<div>
						<h3 className="font-medium">Select Ingredients</h3>
						<div className="grid grid-cols-2 gap-2">
							{ingredients.map((ingredient) => (
								<label
									key={ingredient.id}
									className="flex items-center gap-2">
									<Checkbox
										checked={selectedIngredientIds.includes(
											ingredient.id
										)}
										onCheckedChange={() =>
											handleToggleIngredient(
												ingredient.id
											)
										}
									/>
									{ingredient.name}
								</label>
							))}
						</div>
					</div>
					<Button onClick={handleAddProduct}>Add Product</Button>
				</CardContent>
			</Card>
			<div className="flex flex-wrap gap-6">
				{products.map((product) => (
					<Card key={product.id}>
						<CardContent className="grid gap-2">
							<div className="font-medium">{product.name}</div>
							<div className="text-sm text-muted-foreground">
								<img
									className="w-[100px] h-[100px] rounded-full"
									src={product.imageUrl}
									alt=""
								/>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
