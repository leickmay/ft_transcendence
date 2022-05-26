import { RoomFront } from "../../interfaces/Chat";
import { Packet } from "../packetTypes";

export interface PacketPlayInChatRoom extends Packet {
	room: RoomFront;
}
