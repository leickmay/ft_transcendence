import { ChatTypes, Message } from "../../interfaces/Chat";
import { UserPreview } from "../../interfaces/User";
import { Packet } from "../packetTypes";

export interface PacketPlayInChatCommand extends Packet {
}

export interface PacketPlayInChatMessage extends Packet {
	room: string;
	message: Message;
}

export interface PacketPlayInChatCreate extends Packet {
}

export interface PacketPlayInChatRoomCreate extends Packet {
	id: string;
	type: ChatTypes;
	name: string;
	visible: boolean;
	owner?: number;
	users: Array<UserPreview>;
}

export interface PacketPlayInChatJoin extends Packet {
	room: {
		id: string,
		name: string,
		type: ChatTypes,
		visible: boolean,
		users: Array<UserPreview>,
		owner?: number,
		admins: Array<number>,
	};
}

export interface PacketPlayInChatLeave extends Packet {
}

export interface PacketPlayInChatUp extends Packet {

}

export interface PacketPlayInChatInit extends Packet {
	rooms: Array<{
		id: string,
		name: string,
		type: ChatTypes,
		visible: boolean,
		users: Array<UserPreview>,
		owner?: number,
		admins: Array<number>,
	}>;
	usersBlocked: Array<string>;
}

export interface PacketPlayInChatDel extends Packet {
	room: {
		id: string,
		name: string,
		type: ChatTypes,
		visible: boolean,
		users: Array<UserPreview>,
		owner?: number,
	};
}

export interface PacketPlayInChatOwner extends Packet {
	room: {
		id: string,
		owner: number,
	};
}

export interface PacketPlayInChatBlock extends Packet {
	usersBlocked: Array<string>;
}

export interface PacketPlayInChatAdmin extends Packet {
	room: {
		id: string,
		admins: Array<number>;
	}
}
