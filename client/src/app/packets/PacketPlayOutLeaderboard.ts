import { DeclarePacket, PacketTypesMisc } from "./packetTypes";

@DeclarePacket(PacketTypesMisc.LEADERBOARD)
export class PacketPlayOutLeaderboard {
	constructor(
		public action: 'played' | 'won' | 'level',
	) {}
}
