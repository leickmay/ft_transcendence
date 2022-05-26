import { DeclarePacket, PacketOut, UserPacketTypes } from "./packetTypes";

@DeclarePacket(UserPacketTypes.UPDATE)
export class PacketPlayOutUserUpdate implements PacketOut {
	constructor(
		public user: any,
	) { }
}
