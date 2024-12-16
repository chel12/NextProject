export const mapGameEdition = {
	1: 'PC',
	2: 'PS4',
	3: 'PS5',
} as const;
export const mapGameType = {
	1: 'Цифровая',
	2: 'Дисковая',
} as const;
//делаем массив сущностей для группы вариантов
export const gameEdition = Object.entries(mapGameEdition).map(
	([value, name]) => ({
		name,
		value,
	})
);
export const gameType = Object.entries(mapGameType).map(([value, name]) => ({
	name,
	value,
}));
export type GameEdition = keyof typeof mapGameEdition;
export type GameType = keyof typeof mapGameType;
