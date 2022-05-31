import { DeclarePacket, PacketTypesMisc } from "./packetTypes";

@DeclarePacket(PacketTypesMisc.FRIENDS)
export class PacketPlayOutFriendsUpdate {
	constructor(
		public friends: Record<string, any>,
	) { }
}
