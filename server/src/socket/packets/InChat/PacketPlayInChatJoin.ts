import { Packet } from "../packetTypes";

export interface PacketPlayInChatJoin extends Packet {
	name: string;
	password?: string
}
