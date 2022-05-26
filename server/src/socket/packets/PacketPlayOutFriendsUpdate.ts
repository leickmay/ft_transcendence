import { DeclarePacket, MiscPacketTypes, PacketOut } from "./packetTypes";

@DeclarePacket(MiscPacketTypes.FRIENDS)
export class PacketPlayOutFriendsUpdate implements PacketOut {
	constructor(
		public friends: Record<string, any>,
	) { }
}
