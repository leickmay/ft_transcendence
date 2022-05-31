import { Packet } from "./packetTypes";

export interface PacketPlayInUserDisconnected extends Packet {
	user: number;
}
