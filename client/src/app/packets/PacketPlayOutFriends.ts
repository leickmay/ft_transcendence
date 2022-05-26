import { DeclarePacket, PacketTypesMisc } from "./packetTypes";

@DeclarePacket(PacketTypesMisc.FRIENDS)
export class PacketPlayOutFriends {
	constructor(
		public action: 'add' | 'remove' | 'get',
		public id?: number,
	) {}
}
