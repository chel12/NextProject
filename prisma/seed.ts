import { hashSync } from 'bcrypt';
import { prisma } from './prisma-client';
import { categories, ingredients, products } from './constants';
import { Prisma } from '@prisma/client';

const randomNumber = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min) * 10 + min * 10) / 10;
};
const generateProductItem = ({
	productId,
	gameType,
	size,
}: {
	productId: number;
	gameType?: 1 | 2;
	size?: 20 | 30 | 40;
}) => {
	return {
		productId,
		price: randomNumber(100, 1000),
		gameType,
		size,
	} as Prisma.ProductItemUncheckedCreateInput;
};

async function up() {
	await prisma.user.createMany({
		data: [
			{
				fullName: 'User Test',
				email: 'user@test.ru',
				password: hashSync('111111', 10),
				verified: new Date(),
				role: 'USER',
			},
			{
				fullName: 'Admin Admin',
				email: 'admin@test.ru',
				password: hashSync('111111', 10),
				verified: new Date(),
				role: 'ADMIN',
			},
		],
	});
	await prisma.category.createMany({
		data: categories,
	});
	await prisma.ingredient.createMany({
		data: ingredients,
	});
	await prisma.product.createMany({
		data: products,
	});
	const game1 = await prisma.product.create({
		data: {
			name: 'Call of Duty 4',
			imageUrl:
				'https://gaming-cdn.com/images/products/1620/orig/call-of-duty-4-modern-warfare-pc-mac-game-steam-cover.jpg?v=1701179820',
			categoryId: 1,
			ingredients: {
				connect: ingredients.slice(0, 4),
			},
		},
	});
	const game2 = await prisma.product.create({
		data: {
			name: 'Mafia 2',
			imageUrl:
				'https://cdn.kanobu.ru/games/72/25478a08b5414e78a1cb4764e959004d',
			categoryId: 2,
			ingredients: {
				connect: ingredients.slice(0, 4),
			},
		},
	});
	const game3 = await prisma.product.create({
		data: {
			name: 'Far Cry 3',
			imageUrl:
				'https://cdn.kanobu.ru/games/31/f19e86587b7f4341a77839717de01841',
			categoryId: 2,
			ingredients: {
				connect: ingredients.slice(0, 4),
			},
		},
	});
	await prisma.productItem.createMany({
		data: [
			//game 1
			generateProductItem({ productId: game1.id, gameType: 1, size: 20 }),
			generateProductItem({ productId: game1.id, gameType: 2, size: 40 }),
			//game 2
			generateProductItem({ productId: game2.id, gameType: 1, size: 20 }),
			generateProductItem({ productId: game2.id, gameType: 1, size: 30 }),
			generateProductItem({ productId: game2.id, gameType: 1, size: 40 }),
			generateProductItem({ productId: game2.id, gameType: 2, size: 20 }),
			generateProductItem({ productId: game2.id, gameType: 2, size: 30 }),
			generateProductItem({ productId: game2.id, gameType: 2, size: 40 }),
			//game 3
			generateProductItem({ productId: game3.id, gameType: 1, size: 20 }),
			generateProductItem({ productId: game3.id, gameType: 2, size: 20 }),
			generateProductItem({ productId: game3.id, gameType: 2, size: 30 }),
			//остальные игры
			generateProductItem({ productId: 1 }),
			generateProductItem({ productId: 2 }),
			generateProductItem({ productId: 3 }),
			generateProductItem({ productId: 4 }),
			generateProductItem({ productId: 5 }),
			generateProductItem({ productId: 6 }),
			generateProductItem({ productId: 7 }),
			generateProductItem({ productId: 8 }),
		],
	});
	await prisma.cart.createMany({
		data: [
			{
				userId: 1,
				totalAmount: 0,
				token: '11111',
			},
			{
				userId: 2,
				totalAmount: 0,
				token: '22222',
			},
		],
	});
	await prisma.cartItem.create({
		data: {
			productItemId: 1,
			cartId: 1,
			quantity: 2,
			ingredients: {
				connect: [{ id: 1 }, { id: 2 }, { id: 3 }],
			},
		},
	});
}
async function down() {
	//чтобы инкремент тоже очистить, прямой запрос
	await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
	await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
	await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE`;
	await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE`;
	await prisma.$executeRaw`TRUNCATE TABLE "Ingredient" RESTART IDENTITY CASCADE`;
	await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`;
	await prisma.$executeRaw`TRUNCATE TABLE "ProductItem" RESTART IDENTITY CASCADE`;
}
async function main() {
	try {
		await down();
		await up();
	} catch (error) {
		console.error(error);
	}
}

main()
	.then(async () => await prisma.$disconnect())
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
