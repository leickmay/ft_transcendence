export interface User {
	id: number;
	id42: string;
	login: string;
	name: string;
	intraPicture: string;
	avatarId: number;
	totp?: boolean;
}

export function containsUser(users: Array<User>, user: User): boolean {
	return !!users.find(e => e.id === user.id);
}
