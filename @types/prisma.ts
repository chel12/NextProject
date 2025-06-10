import { Product, Category, Ingredient, ProductItem } from '@prisma/client';

export type ProductWithRelations = Product & {
	category: Category;
	items: ProductItem[];
	ingredients: Ingredient[];
};
