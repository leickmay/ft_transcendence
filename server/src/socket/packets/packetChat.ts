import { ChatEvents, Message, RoomBack, RoomFront } from "src/chat/chat.interface";
import { DeclarePacket, Packet, PacketOut, PacketOutTypes } from "./packets";

// =================================== \\
// ========== PacketChatIn  ========== \\
// =================================== \\

export interface PacketChatIn extends Packet {
	event: ChatEvents;
	room: RoomBack | undefined;
	msg: Message | undefined;
}

// =================================== \\
// ========== PacketChatOut ========== \\
// =================================== \\

@DeclarePacket(PacketOutTypes.CHAT)
export class PacketChatOut implements PacketOut {
	constructor(
		public event: ChatEvents,
		public room: RoomFront | undefined,
		public msg: Message | undefined,
	) { }
}
