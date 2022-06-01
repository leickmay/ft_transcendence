import { PacketTypesChat, DeclarePacket } from "../packetTypes";

@DeclarePacket(PacketTypesChat.CREATE)
export class PacketPlayOutChatChannelCreate {
	public password?: string;

	constructor(
		public name: string,
		public visible: boolean,
	) {}

	withPassword(password?: string): PacketPlayOutChatChannelCreate {
		this.password = password;
		return this;
	}
}
