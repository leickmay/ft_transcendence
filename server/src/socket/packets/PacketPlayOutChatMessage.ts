import { Message } from "src/chat/chat.interface";

export class PacketPlayOutChatMessage {
	constructor(
		public room: string,
		public message: Message,
	) { }
}
