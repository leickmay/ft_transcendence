export default interface User {
	name: string,
	avatar: string,
	level: number,
	online: boolean,
	ingame: boolean,
	friends: any[],
	id: number
}
