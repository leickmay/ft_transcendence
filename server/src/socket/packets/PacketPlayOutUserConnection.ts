import { DeclarePacket, PacketOut, PacketTypesUser } from "./packetTypes";

@DeclarePacket(PacketTypesUser.CONNECTION)
export class PacketPlayOutUserConnection implements PacketOut {
	constructor(
		public users: Record<string, any>,
	) { }
}
