import { ChatTypes } from "../../interfaces/Chat";
import { Packet } from "../packetTypes";

export interface PacketPlayInChatRoomCreate extends Packet {
	id: string,
	type: ChatTypes,
	name: string,
	visible: boolean,
	operator?: number,
	users: number[],
}
