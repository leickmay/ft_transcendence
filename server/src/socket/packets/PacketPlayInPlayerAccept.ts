import { Packet } from "./packetTypes";

export interface PacketPlayInPlayerAccept extends Packet {
	room: number;
}
