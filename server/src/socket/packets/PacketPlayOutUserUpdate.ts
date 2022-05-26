import { DeclarePacket, PacketOut, PacketTypesUser } from "./packetTypes";

@DeclarePacket(PacketTypesUser.UPDATE)
export class PacketPlayOutUserUpdate implements PacketOut {
	constructor(
		public user: any,
	) { }
}
