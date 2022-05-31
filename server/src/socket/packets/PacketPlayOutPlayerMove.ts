import { DeclarePacket, Directions, PacketTypesMisc } from "./packetTypes";

@DeclarePacket(PacketTypesMisc.PLAYER_MOVE)
export class PacketPlayOutPlayerMove {
	constructor(
		public player: number,
		public direction: Directions,
	) { }
}
