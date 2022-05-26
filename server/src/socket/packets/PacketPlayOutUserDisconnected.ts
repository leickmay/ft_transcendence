import { DeclarePacket, PacketOut, UserPacketTypes } from "./packetTypes";

@DeclarePacket(UserPacketTypes.DISCONNECTED)
export class PacketPlayOutUserDisconnected implements PacketOut {
	constructor(
		public user: number,
	) { }
}
