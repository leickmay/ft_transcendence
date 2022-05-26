import { ChatPacketTypes, DeclarePacket } from "./packetTypes";

@DeclarePacket(ChatPacketTypes.MESSAGE)
export class PacketPlayOutChatMessage {
	constructor(
		public room: string,
		public text: string,
	) { }
}
