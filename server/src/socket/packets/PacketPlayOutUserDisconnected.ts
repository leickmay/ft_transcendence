import { DeclarePacket, PacketTypesUser } from "./packetTypes";

@DeclarePacket(PacketTypesUser.DISCONNECTED)
export class PacketPlayOutUserDisconnected {
	constructor(
		public user: {id: number, login: string},
	) { }
}
