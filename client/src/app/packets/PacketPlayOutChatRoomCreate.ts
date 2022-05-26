import { PacketOutChatRoom } from "./PacketOutChatRoom";
import { ChatPacketTypes, DeclarePacket } from "./packetTypes";

@DeclarePacket(ChatPacketTypes.CREATE)
export class PacketPlayOutChatRoomCreate extends PacketOutChatRoom {
	public password?: string;

	withPassword(password?: string): PacketPlayOutChatRoomCreate {
		this.password = password;
		return this;
	}
}
