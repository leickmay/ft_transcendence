import { DeclarePacket, PacketTypesMisc } from "./packetTypes";

@DeclarePacket(PacketTypesMisc.STATS_UPDATE)
export class PacketPlayOutStatsUpdate {
	constructor(
		public nbMatchs: number,
		public matchWon: number,
		public history: Record<string, any>,
	) { }
}
