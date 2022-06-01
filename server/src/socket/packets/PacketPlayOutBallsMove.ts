import { DeclarePacket, PacketTypesBalls } from "./packetTypes";

@DeclarePacket(PacketTypesBalls.MOVE)
export class PacketPlayOutBallsMove {
	constructor(
		public id: number,
		public size: number,
		public x: number,
		public y: number,
	) { }
}
