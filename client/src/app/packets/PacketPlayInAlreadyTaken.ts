import { Packet } from "./packetTypes";

export interface PacketPlayInAlreadyTaken extends Packet {
	name: string;
}