import { UserStats } from "src/stats/userStats";
import { DeclarePacket, PacketTypesStats } from "./packetTypes";

@DeclarePacket(PacketTypesStats.STATS_UPDATE)
export class PacketPlayOutStatsUpdate {
	constructor(
		public stats: UserStats,
	) { }
}
