import { DeclarePacket, PacketTypesChat } from "../packetTypes";

@DeclarePacket(PacketTypesChat.JOIN)
export class PacketPlayOutChatChannelJoin {
	public password?: string;

	constructor(
		public name: string,
	) {}

	withPassword(password?: string): PacketPlayOutChatChannelJoin {
		this.password = password;
		return this;
	}
}
