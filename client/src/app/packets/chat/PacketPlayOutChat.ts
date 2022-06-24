import { ChatTypes } from "../../interfaces/Chat";
import { PacketTypesChat, DeclarePacket } from "../packetTypes";

@DeclarePacket(PacketTypesChat.MESSAGE)
export class PacketPlayOutChatMessage {
	constructor(
		public room: string,
		public text: string,
	) { }
}

@DeclarePacket(PacketTypesChat.CREATE)
export class PacketPlayOutChatCreate {
	public type: ChatTypes;
	public name?: string;
	public visible?: boolean;
	public password?: string;
	public users?: Array<number>;

	constructor(type: ChatTypes) {
		this.type = type;
	}

	toPrivateMessage(users: Array<number>) {
		if (this.type !== ChatTypes.PRIVATE_MESSAGE)
			return this;
		this.users = users;
		return this;
	}

	toChannel(name: string, visible: boolean) {
		if (this.type !== ChatTypes.CHANNEL)
			return this;
		this.name = name;
		this.visible = visible;
		return this;
	}

	withPassword(password?: string): PacketPlayOutChatCreate {
		if (this.type !== ChatTypes.CHANNEL)
			return this;
		this.password = password;
		return this;
	}
}

@DeclarePacket(PacketTypesChat.JOIN)
export class PacketPlayOutChatJoin {
	public password?: string;

	constructor(
		public name: string,
	) {}

	withPassword(password?: string): PacketPlayOutChatJoin {
		this.password = password;
		return this;
	}
}
