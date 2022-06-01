import { User } from "./User";

export interface Message {
	date: number;
	from: string;
	text: string;
}

export enum ChatTypes {
	CHANNEL,
	PRIVATE_MESSAGE,
}

export interface ChatRoom {
	id: string,
	type: ChatTypes;
	name: string;
	messages: Message[];
	visible: boolean;
	operator?: number;
}

export interface Command {
	user: User;
	cmd: string[];
}
