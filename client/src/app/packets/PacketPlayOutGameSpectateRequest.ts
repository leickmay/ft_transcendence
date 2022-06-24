import { DeclarePacket, PacketTypesGame } from "./packetTypes";

@DeclarePacket(PacketTypesGame.SPECTATE)
export class PacketPlayOutGameSpectateRequest {
	constructor(
		public target: number,
	) {}
}
