export const categories = [
	{
		name: 'Шутеры',
	},
	{
		name: 'Экшен',
	},
	{
		name: 'Стратегия',
	},
	{
		name: 'Гонки',
	},
	{
		name: 'Симуляторы',
	},
	{
		name: 'Военная тематика',
	},
	{
		name: 'Выживание',
	},
	{
		name: 'Хоррор',
	},
];
export const _ingredients = [
	{
		name: 'классическая упаковка',
		price: 10,
		imageUrl: 'https://cdlabs.ru/wp-content/uploads/2016/06/DVD-Box.png',
	},
	{
		name: 'праздничная упаковка',
		price: 15,
		imageUrl:
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmNXodlCKSqSLPMswykd4skmK80VZ3Ina4RQ&s',
	},
	{
		name: 'прозрачная упаковка',
		price: 15,
		imageUrl:
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX8TGO1f94IvBNcBK_-K7YiVEqBc_4J3xwVw&s',
	},
	{
		name: 'кастомная упаковка',
		price: 100,
		imageUrl:
			'https://img.freepik.com/free-psd/christmas-gift-isolated_23-2151250408.jpg',
	},
	{
		name: 'необычная упаковка',
		price: 6,
		imageUrl:
			'https://img.freepik.com/free-psd/christmas-gift-isolated_23-2151250408.jpg',
	},
	{
		name: 'новогодняя упаковка',
		price: 4,
		imageUrl:
			'https://img.freepik.com/free-psd/christmas-gift-isolated_23-2151250408.jpg',
	},
	{
		name: 'хеллуинская упаковка',
		price: 5,
		imageUrl:
			'https://img.freepik.com/free-psd/christmas-gift-isolated_23-2151250408.jpg',
	},
].map((obj, index) => ({ id: index + 1, ...obj }));
export const products = [
	{
		name: 'Call of Duty: Modern Warfare III',
		categoryId: 1,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/ru/a/ad/Call_of_Duty_Modern_Warfare_3_box_art.jpg',
	},
	{
		name: 'Warzone',
		categoryId: 1,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/6/65/COD_Warzone_Cover_Art.jpg',
	},
	{
		name: 'Black Ops 6',
		categoryId: 2,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/c/c9/Call_of_Duty_Black_Ops_6_Key_Art.png',
	},
	{
		name: 'Minecraft',
		categoryId: 2,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/b/b6/Minecraft_2024_cover_art.png',
	},
	{
		name: 'Grand Theft Auto V',
		categoryId: 3,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png',
	},
	{
		name: 'Helldivers 2',
		categoryId: 3,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/e/e7/Helldivers2cover.png',
	},
	{
		name: 'Diablo IV',
		categoryId: 4,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/1/1c/Diablo_IV_cover_art.png',
	},
	{
		name: 'Kingdom Come: Deliverance 2',
		categoryId: 5,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/3/32/Kingdom_Come_Deliverance_II.jpg',
	},
	{
		name: 'Doom: The Dark Ages',
		categoryId: 6,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/7/7f/DOOM%2C_The_Dark_Ages_Game_Cover.jpeg',
	},
	{
		name: 'Clair Obscur: Expedition 33',
		categoryId: 7,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Clair_Obscur%2C_Expedition_33_Cover_1.webp/272px-Clair_Obscur%2C_Expedition_33_Cover_1.webp.png',
	},
	{
		name: 'Wuchang: Fallen Feathers',
		categoryId: 8,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/c/c4/Wuchang_Fallen_Feathers_cover_art.jpg',
	},
];
