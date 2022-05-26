import { RoomBack } from "../../interfaces/Chat";
import { Packet, PacketTypes } from "../packetTypes";


export class PacketPlayOutChatRoom implements Packet {
	constructor(
		public packet_id: PacketTypes,
		public room: RoomBack,
	) { }
}
