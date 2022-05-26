import { DeclarePacket, PacketTypesMisc, PacketOut } from "./packetTypes";

@DeclarePacket(PacketTypesMisc.FRIENDS)
export class PacketPlayOutFriendsUpdate implements PacketOut {
	constructor(
		public friends: Record<string, any>,
	) { }
}
