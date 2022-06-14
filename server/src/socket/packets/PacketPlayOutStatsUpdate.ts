import { Stats } from "src/stats/stats.entity";
import { DeclarePacket, PacketTypesStats } from "./packetTypes";

@DeclarePacket(PacketTypesStats.STATS_UPDATE)
export class PacketPlayOutStatsUpdate {
	constructor(
		public nbMatchs: number,
		public matchWon: number,
		public history: Record<string, any>,
	) { }
}
