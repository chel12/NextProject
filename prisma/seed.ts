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
	platformType,
}: {
	productId: number;
	gameType?: 1 | 2;
	platformType?: 1 | 2 | 3;
}) => {
	return {
		productId,
		price: randomNumber(100, 1000),
		gameType,
		platformType,
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
				connect: ingredients.slice(0, 6),
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
				connect: ingredients.slice(0, 7),
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
				connect: ingredients.slice(0, 8),
			},
		},
	});
	await prisma.productItem.createMany({
		data: [
			//game 1
			generateProductItem({
				productId: game1.id,
				gameType: 1,
				platformType: 1,
			}),
			generateProductItem({
				productId: game1.id,
				gameType: 2,
				platformType: 3,
			}),
			//game 2
			generateProductItem({
				productId: game2.id,
				gameType: 1,
				platformType: 1,
			}),
			generateProductItem({
				productId: game2.id,
				gameType: 1,
				platformType: 2,
			}),
			generateProductItem({
				productId: game2.id,
				gameType: 1,
				platformType: 3,
			}),
			generateProductItem({
				productId: game2.id,
				gameType: 2,
				platformType: 1,
			}),
			generateProductItem({
				productId: game2.id,
				gameType: 2,
				platformType: 2,
			}),
			generateProductItem({
				productId: game2.id,
				gameType: 2,
				platformType: 3,
			}),
			//game 3
			generateProductItem({
				productId: game3.id,
				gameType: 1,
				platformType: 1,
			}),
			generateProductItem({
				productId: game3.id,
				gameType: 2,
				platformType: 1,
			}),
			generateProductItem({
				productId: game3.id,
				gameType: 2,
				platformType: 2,
			}),
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
	await prisma.story.createMany({
		data: [
			{
				previewImageUrl:
					'https://i.pinimg.com/736x/21/d9/a2/21d9a2a20346a55c62d773d6444e314e.jpg',
			},
			{
				previewImageUrl:
					'https://i.pinimg.com/736x/e9/56/0a/e9560a404bee66ddf4ace249bfebb664.jpg',
			},
			{
				previewImageUrl:
					'https://i.pinimg.com/736x/60/a7/f1/60a7f195ff450f0e56d1ed525d8a21b6.jpg',
			},
			{
				previewImageUrl:
					'https://i.pinimg.com/736x/c2/47/c2/c247c2cff0367b19b1a4beae0ebc1eaa.jpg',
			},
			{
				previewImageUrl:
					'https://i.pinimg.com/736x/36/7b/21/367b211afca91a2026b33b827364cc43.jpg',
			},
			{
				previewImageUrl:
					'https://i.pinimg.com/736x/01/64/48/01644841f6786547758d5dfb4a270f21.jpg',
			},
		],
	});
	await prisma.storyItem.createMany({
		data: [
			{
				storyId: 13,
				sourceUrl:
					'https://i.pinimg.com/736x/ff/8e/65/ff8e65f546e61bc74615aacd5900af02.jpg',
			},
			{
				storyId: 13,
				sourceUrl:
					'https://i.pinimg.com/736x/2c/23/d8/2c23d8218ea74f186de222789f0b0cc7.jpg',
			},
			{
				storyId: 13,
				sourceUrl:
					'https://i.pinimg.com/736x/ca/46/74/ca46747fd528ccb8adeca640c6f1b781.jpg',
			},
			{
				storyId: 13,
				sourceUrl:
					'https://i.pinimg.com/736x/03/7b/86/037b86e2b899e7ce4f0371e88be3ce1f.jpg',
			},
			{
				storyId: 13,
				sourceUrl:
					'https://i.pinimg.com/736x/ed/c7/22/edc722cfb954c5929d5f92b661ca3ebc.jpg',
			},
			{
				storyId: 14,
				sourceUrl:
					'https://i.pinimg.com/736x/b7/d7/e8/b7d7e8ec68d5f6d82e50af7245ded879.jpg',
			},
			{
				storyId: 14,
				sourceUrl:
					'https://i.pinimg.com/736x/a8/f2/0f/a8f20ffede2052b7fc5a5e462de1507e.jpg',
			},
			{
				storyId: 14,
				sourceUrl:
					'https://i.pinimg.com/736x/a4/39/88/a4398802beb32e5f287f04620344e47d.jpg',
			},
			{
				storyId: 14,
				sourceUrl:
					'https://i.pinimg.com/736x/b8/2f/71/b82f71f0d630b22d9c00caae71a72094.jpg',
			},
			{
				storyId: 14,
				sourceUrl:
					'https://i.pinimg.com/736x/76/2e/3a/762e3ae3e9ee0f35c1fc21463a5fe3f4.jpg',
			},
		],
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
