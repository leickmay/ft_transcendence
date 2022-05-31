import { DeclarePacket, PacketTypesUser } from "./packetTypes";

@DeclarePacket(PacketTypesUser.UPDATE)
export class PacketPlayOutUserUpdate {
	constructor(
		public user: any,
	) { }
}
