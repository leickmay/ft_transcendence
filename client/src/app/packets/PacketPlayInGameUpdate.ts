import { Packet } from "./packetTypes";

export interface PacketPlayInGameUpdate extends Packet {
	data: any;
}
