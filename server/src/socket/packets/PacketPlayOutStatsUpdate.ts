import { DeclarePacket, PacketTypesMisc } from "./packetTypes";

@DeclarePacket(PacketTypesMisc.STATS_UPDATE)
export class PacketPlayOutStatsUpdate {
	constructor(
		public stats: {
			nbMatchs: number,
			matchWon: number,
			history: Record<string, any>,
		}
	) { }
}
