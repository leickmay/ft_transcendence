import { DeclarePacket, PacketTypesBall } from "./packetTypes";

@DeclarePacket(PacketTypesBall.UPDATE)
export class PacketPlayOutBallUpdate {
	constructor(
		public ball: number,
		public direction?: { x: number, y: number },
		public size?: number,
		public speed?: number,
		public x?: number,
		public y?: number,
	) { }
}
