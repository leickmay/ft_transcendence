import { Room } from "src/chat/chat.interface";
import { Packet } from "./packetTypes";

export interface PacketPlayInChatRoom extends Packet {
	room: Room;
}
