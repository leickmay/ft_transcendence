export interface User {
	id: number;
	login: string;
	name: string;
	avatar: string;
	totp?: boolean | string;
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
