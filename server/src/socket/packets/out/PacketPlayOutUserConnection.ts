import { DeclarePacket, PacketOut, UserPacketTypes } from "../packetTypes";

@DeclarePacket(UserPacketTypes.USER_CONNECTION)
export class PacketPlayOutUserConnection implements PacketOut {
	constructor(
		public users: Record<string, any>,
	) { }
}
