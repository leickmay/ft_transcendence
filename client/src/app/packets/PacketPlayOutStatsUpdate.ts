import { DeclarePacket, PacketTypesMisc } from "./packetTypes";

/**
 * @deprecated
 */
@DeclarePacket(PacketTypesMisc.STATS_UPDATE)
export class PacketPlayOutStatsUpdate {
	constructor (
		public winnerId: number,
		public p1Id: number,
		public p2Id: number,
	) {}
}