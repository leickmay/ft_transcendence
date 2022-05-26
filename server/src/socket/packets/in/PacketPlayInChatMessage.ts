import { Message } from "src/chat/chat.interface";
import { Packet } from "../packetTypes";

export interface PacketPlayInChatMessage extends Packet {
	msg: Message;
}
