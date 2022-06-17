import { User } from "src/user/user.entity";
import { DeclarePacket, PacketTypesMisc } from "./packetTypes";

@DeclarePacket(PacketTypesMisc.LEADERBOARD)
export class PacketPlayOutLeaderboard {
	constructor (
		public users: Record<string, any> | Array<Partial<User>>,
	) { }
}
