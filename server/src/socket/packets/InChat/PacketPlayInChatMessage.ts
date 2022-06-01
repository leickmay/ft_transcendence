import { Packet } from "../packetTypes";

export interface PacketPlayInChatMessage extends Packet {
	room: string;
	text: string;
}
