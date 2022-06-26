import { UserPreview, User } from "./User";

export interface Message {
	date: number;
	from: {
		login: string;
		name: string;
	};
	text: string;
	cmd: boolean;
}

export enum ChatTypes {
	CHANNEL,
	PRIVATE_MESSAGE,
}

export interface ChatRoom {
	id: string;
	type: ChatTypes;
	name: string;
	visible: boolean;
	users: Array<UserPreview>;
	owner?: number;
	admins: Array<number>;
	messages: Array<Message>;
}

export interface Command {
	user: User;
	room: string;
	cmd: string[];
}
