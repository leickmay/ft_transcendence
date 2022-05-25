import { ChatEvents, Message, RoomBack, RoomFront } from "../interfaces/Chat";
import { DeclarePacket, Packet, PacketOut, PacketOutTypes } from "./packets";

// =================================== \\
// ========== PacketChatIn  ========== \\
// =================================== \\

export interface PacketChatIn extends Packet {
	event: ChatEvents;
	room: RoomFront | undefined;
	msg: Message | undefined;
}

// =================================== \\
// ========== PacketChatOut ========== \\
// =================================== \\

@DeclarePacket(PacketOutTypes.CHAT)
export class PacketChatOut implements PacketOut {
	constructor(
		public event: ChatEvents,
		public room: RoomBack | undefined,
		public msg: Message | undefined,
	) { }
}
