import { DeclarePacket, PacketOut, PacketTypesUser } from "./packetTypes";

@DeclarePacket(PacketTypesUser.DISCONNECTED)
export class PacketPlayOutUserDisconnected implements PacketOut {
	constructor(
		public user: number,
	) { }
}
