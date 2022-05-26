import { Room } from "src/chat/chat.interface";
import { PacketOut, PacketTypes } from "./packetTypes";

export class PacketPlayOutChatRoom implements PacketOut {
	constructor(
		public packet_id: PacketTypes,
		public room: Room,
	) { }
}
