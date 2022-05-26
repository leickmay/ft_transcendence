import { User } from "src/user/user.entity";

export enum ChatEvents {
	COMMAND,
    MESSAGE,
	CREATE,
    JOIN,
	UP,
    QUIT,
    DELETE,
}

export interface Message {
	from: string;
	to: string;
	date: string;
	message: string;
}

export interface RoomFront {
	name: string;
	users: User[];
	isPrivateMsg: boolean;
	isChannel: boolean;
	operator: string | undefined;
	isPrivate: boolean;
	messages: Message[];
}

export interface RoomBack {
	name: string;
	users: User[];
	isPrivateMsg: boolean;
	isChannel: boolean;
	operator: string | undefined;
	isPrivate: boolean;
	password: string | undefined;
	messages: Message[];
}

export interface Command {
	user: User;
	cmd: string[];
}
