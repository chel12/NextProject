// types/order.ts
import { Ingredient, Product, ProductItem } from '@prisma/client';

export type OrderItemDTO = {
  id: number;
  quantity: number;
  productItem: ProductItem & {
    product: Product;
  };
  ingredients: Ingredient[];
};
