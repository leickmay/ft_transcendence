import { DeclarePacket, PacketTypesPlayer } from "./packetTypes";

@DeclarePacket(PacketTypesPlayer.LIST)
export class PacketPlayOutPlayerList {
	constructor(
		public users: Record<string, any>,
	) { }
}
