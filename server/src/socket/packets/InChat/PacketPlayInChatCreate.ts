import { Packet } from "../packetTypes";

export interface PacketPlayInChatCreate extends Packet {
	name: string;
	visible: boolean;
	password?: string;
}
