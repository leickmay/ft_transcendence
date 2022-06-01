import { User } from "./User";

export interface Message {
	date: number;
	from: string;
	text: string;
}

export enum ChatFlags {
	CHANNEL,
	PRIVATE_MESSAGE,
}

export interface Room {
	id: string,
	name: string;
	messages: Message[];
	operator?: string;
	flags: ChatFlags;
}

export interface Command {
	user: User;
	cmd: string[];
}
