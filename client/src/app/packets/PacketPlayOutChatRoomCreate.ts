import { PacketOutChatRoom } from "./PacketOutChatRoom";
import { PacketTypesChat, DeclarePacket } from "./packetTypes";

@DeclarePacket(PacketTypesChat.CREATE)
export class PacketPlayOutChatRoomCreate extends PacketOutChatRoom {
	public password?: string;

	withPassword(password?: string): PacketPlayOutChatRoomCreate {
		this.password = password;
		return this;
	}
}
