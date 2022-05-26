import { DeclarePacket, MiscPacketTypes } from "../packetTypes";

@DeclarePacket(MiscPacketTypes.FRIENDS)
export class PacketPlayOutFriends {
	constructor(
		public action: 'add' | 'remove' | 'get',
		public id?: number,
	) {}
}
