import { PacketTypesChat, DeclarePacket } from "./packetTypes";

@DeclarePacket(PacketTypesChat.CREATE)
export class PacketPlayOutChatRoomCreate {
	public password?: string;

	withPassword(password?: string): PacketPlayOutChatRoomCreate {
		this.password = password;
		return this;
	}
}
