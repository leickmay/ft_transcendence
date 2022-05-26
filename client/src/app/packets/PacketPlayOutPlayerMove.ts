import { DeclarePacket, Directions, MiscPacketTypes } from "./packetTypes";

@DeclarePacket(MiscPacketTypes.PLAYER_MOVE)
export class PacketPlayOutPlayerMove {
	constructor(
		public direction: Directions,
	) {}
}
