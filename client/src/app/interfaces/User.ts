export interface User {
	id: number;
	login: string;
	name: string;
	avatar: string;
	nbMatch?: number;
	matchWon?: number;
	totp?: boolean | string;
	xp: number;
}

export interface UserPreview {
	id: number;
	login: string;
	name?: string;
}

export type UpdateUserDto = Partial<User> & { id: number };

export function containsUser(users: Array<User>, user: User): boolean {
	return !!users.find(e => e.id === user.id);
}
