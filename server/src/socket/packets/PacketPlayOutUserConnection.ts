import { DeclarePacket, PacketTypesUser } from "./packetTypes";

@DeclarePacket(PacketTypesUser.CONNECTION)
export class PacketPlayOutUserConnection {
	constructor(
		public users: Array<number>,
	) { }
}
