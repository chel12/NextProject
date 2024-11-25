import { Ingredient } from '@prisma/client';
import { Api } from '@/services/api-client';
import React from 'react';

interface ReturnProps {
	ingredients: Ingredient[];
}

export const useFilterIngredients = (): ReturnProps => {
	const [ingredients, setIngredients] = React.useState<Ingredient[]>([]);
	React.useEffect(() => {
		async function fetchIngredients() {
			try {
				const ingredients = await Api.ingredients.getAll();
				setIngredients(ingredients);
			} catch (error) {
				console.log(error);
			}
		}

		//или 2 вариант написания
		// Api.ingredients
		// 	.getAll()
		// 	.then((data) => {
		// 		setItems(data);
		// 	})
		// 	.catch((error) => console.log(error));

		fetchIngredients();
	}, []);
	return { ingredients };
};
