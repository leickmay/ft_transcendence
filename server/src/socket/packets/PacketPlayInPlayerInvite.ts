import { Packet } from "./packetTypes";

export interface PacketPlayInPlayerInvite extends Packet {
	target: number;
}
