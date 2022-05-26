import { Message } from "src/chat/chat.interface";
import { Packet, PacketTypes } from "../packetTypes";

export class PacketPlayOutChatMessage implements Packet {
	constructor(
		public packet_id: PacketTypes,
		public message: Message,
	) { }
}
