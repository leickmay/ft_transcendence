import { PacketTypesChat, DeclarePacket } from "./packetTypes";

@DeclarePacket(PacketTypesChat.LIST)
export class PacketPlayOutChatRoomList {
	constructor(
		public rooms: Array<{
			id: string,
			name: string,
		}>,
	) { }
}
