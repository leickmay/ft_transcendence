import { ChatTypes, Message} from "src/chat/chat.interface";
import { UserPreview } from "src/user/user.entity";
import { DeclarePacket, PacketTypesChat } from "../packetTypes";

@DeclarePacket(PacketTypesChat.MESSAGE)
export class PacketPlayOutChatMessage {
	constructor(
		public room: string,
		public message: Message,
	) {}
}

@DeclarePacket(PacketTypesChat.JOIN)
export class PacketPlayOutChatJoin {
	constructor(
		public room: {
			id: string,
			name: string,
			type: ChatTypes,
			visible: boolean,
			users: Array<UserPreview>,
			owner?: number,
			admins: Array<number>,
		},
	) {}
}

@DeclarePacket(PacketTypesChat.INIT)
export class PacketPlayOutChatInit {
	constructor(
		public rooms: Array<{
			id: string,
			name: string,
			type: ChatTypes,
			visible: boolean,
			owner?: number,
			admins: Array<number>;
		}>,
		public usersBlocked: Array<string>,
	) {}
}

@DeclarePacket(PacketTypesChat.DEL)
export class PacketPlayOutChatDel {
	constructor(
		public room: {
			id: string,
			name: string,
			type: ChatTypes,
			visible: boolean,
			users: Array<UserPreview>,
			owner?: number,
		},
	) {}
}

@DeclarePacket(PacketTypesChat.OWNER)
export class PacketPlayOutChatOwner {
	constructor(
		public room: {
			id: string,
			owner: number,
		},
	) {}
}

@DeclarePacket(PacketTypesChat.ADMIN)
export class PacketPlayOutChatAdmin {
	constructor(
		public room: {
			id: string,
			admins: Array<number>;
		},
	) {}
}

@DeclarePacket(PacketTypesChat.BLOCK)
export class PacketPlayOutChatBlock {
	constructor(
		public usersBlocked: Array<string>,
	) {}
}
