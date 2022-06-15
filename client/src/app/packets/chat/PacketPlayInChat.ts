import { ChatRoom, ChatTypes, Message } from "../../interfaces/Chat";
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
	operator?: number;
	users: number[];
}

export interface PacketPlayInChatJoin extends Packet {
	room: {
		id: string,
		name: string,
		type: ChatTypes,
		visible: boolean,
		users: Array<number>,
		operator?: number,
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
		users: Array<number>,
		operator?: number,
	}>;
}

export interface PacketPlayInChatDel extends Packet {
	room: {
		id: string,
		name: string,
		type: ChatTypes,
		visible: boolean,
		users: Array<number>,
		operator?: number,
	};
}
