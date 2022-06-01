import { PacketTypesChat, DeclarePacket } from "../packetTypes";

@DeclarePacket(PacketTypesChat.MESSAGE)
export class PacketPlayOutChatMessage {
	constructor(
		public room: string,
		public text: string,
	) { }
}
