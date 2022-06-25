import { DeclarePacket, PacketTypesGame } from "./packetTypes";

@DeclarePacket(PacketTypesGame.ACCEPT)
export class PacketPlayOutPlayerAccept {
	constructor(
		public room: number,
	) {}
}
