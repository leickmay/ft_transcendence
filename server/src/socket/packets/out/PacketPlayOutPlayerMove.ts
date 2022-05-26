import { DeclarePacket, Directions, MiscPacketTypes, Packet, PacketOut } from "../packetTypes";

@DeclarePacket(MiscPacketTypes.PLAYER_MOVE)
export class PacketPlayOutPlayerMove implements PacketOut {
	constructor(
		public player: number,
		public direction: Directions,
	) { }
}
