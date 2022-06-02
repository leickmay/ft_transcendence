import { ChatTypes } from "src/chat/chat.interface";
import { DeclarePacket, PacketTypesChat } from "../packetTypes";

@DeclarePacket(PacketTypesChat.CREATE)
export class PacketPlayOutChatRoomCreate {
	constructor(
		public id: string,
		public type: ChatTypes,
		public name: string,
		public visible: boolean,
		public users: number[],
		public operator?: number,
	) { }
}
