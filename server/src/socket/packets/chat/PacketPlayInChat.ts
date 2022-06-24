import { ChatTypes } from "src/chat/chat.interface";
import { Packet } from "../packetTypes";

export interface PacketPlayInChatMessage extends Packet {
	room: string;
	text: string;
}

export interface PacketPlayInChatCreate extends Packet {
	type: ChatTypes;
	name?: string;
	visible?: boolean;
	password?: string;
	users?: Array<number>;
}

export interface PacketPlayInChatJoin extends Packet {
	name: string;
	password?: string
}
