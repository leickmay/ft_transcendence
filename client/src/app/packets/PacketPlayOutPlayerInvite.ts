import { DeclarePacket, PacketTypesGame } from "./packetTypes";

@DeclarePacket(PacketTypesGame.INVITATION)
export class PacketPlayOutPlayerInvite {
	constructor(
		public target: number,
	) {}
}
