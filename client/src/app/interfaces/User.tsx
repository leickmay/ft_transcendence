export interface User {
	id: number;
	id42: string;
	login: string;
	name: string;
	avatar: string;
	totp?: boolean;
}

export function containsUser(users: Array<User>, user: User): boolean {
	return !!users.find(e => e.id === user.id);
}
