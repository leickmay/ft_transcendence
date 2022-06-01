import { DeclarePacket, PacketTypesPlayer } from "./packetTypes";

@DeclarePacket(PacketTypesPlayer.JOIN)
export class PacketPlayOutPlayerJoin {
	constructor(
		public player: Record<string, any>,
	) { }
}
