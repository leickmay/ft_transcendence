import { Message } from "../../interfaces/Chat";
import { Packet, PacketTypes } from "../packetTypes";

export class PacketPlayOutChatMessage implements Packet {
	constructor(
		public packet_id: PacketTypes,
		public message: Message,
	) { }
}
