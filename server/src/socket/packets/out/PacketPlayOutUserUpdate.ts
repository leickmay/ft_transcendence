import { DeclarePacket, PacketOut, UserPacketTypes } from "../packetTypes";

@DeclarePacket(UserPacketTypes.USER_UPDATE)
export class PacketPlayOutUserUpdate implements PacketOut {
	constructor(
		public user: any,
	) { }
}
