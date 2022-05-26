import { Message } from "../interfaces/Chat";
import { Packet } from "./packetTypes";

export interface PacketPlayInChatMessage extends Packet {
	room: string,
	message: Message;
}
