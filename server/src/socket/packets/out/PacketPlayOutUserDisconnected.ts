import { DeclarePacket, PacketOut, UserPacketTypes } from "../packetTypes";

@DeclarePacket(UserPacketTypes.USER_DISCONNECTED)
export class PacketPlayOutUserDisconnected implements PacketOut {
	constructor(
		public user: number,
	) { }
}
