import { DeclarePacket, Directions, PacketTypesMisc, Packet, PacketOut } from "./packetTypes";

@DeclarePacket(PacketTypesMisc.PLAYER_MOVE)
export class PacketPlayOutPlayerMove implements PacketOut {
	constructor(
		public player: number,
		public direction: Directions,
	) { }
}
