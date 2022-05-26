import { ChatPacketTypes, DeclarePacket } from "./packetTypes";

@DeclarePacket(ChatPacketTypes.LIST)
export class PacketPlayOutChatRoomList {
	constructor(
		public rooms: Array<{
			id: string,
			name: string,
		}>,
	) { }
}
