import { Packet } from "./packetTypes";

export interface PacketPlayInUserConnection extends Packet {
	users: Array<number>;
}
