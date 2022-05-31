import { User } from "./User";

export interface Message {
	date: number;
	from: string;
	text: string;
}

// export enum RoomType {
// 	PUBLIC,
// 	PASSWORD,
// 	PRIVATE,
// 	PRIVATE_PASSWORD,
// 	PRIVATE_MESSAGE,
// }

export interface Room {
	id: number,
	name: string;
	messages: Message[];
	operator?: string;
	flags: number;
}

export interface Command {
	user: User;
	cmd: string[];
}
