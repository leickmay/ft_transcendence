export interface User {
	id: number;
	id42: string;
	login: string;
	name: string;
	avatar: string;
	friends?: Array<User>;
}
