import { Packet } from "./packetTypes";

export interface PacketPlayInStatsUpdate extends Packet {
	winnerId: number;
	p1Id: number;
	p2Id: number;
	id: number,
}
