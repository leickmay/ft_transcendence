import { DeclarePacket, PacketTypesGame } from "./packetTypes";

@DeclarePacket(PacketTypesGame.UPDATE)
export class PacketPlayOutGameUpdate {
	constructor(
		public data: Record<string, any>,
	) { }
}
