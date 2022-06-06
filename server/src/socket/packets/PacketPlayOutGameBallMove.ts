import { DeclarePacket, PacketTypesGame } from "./packetTypes";

@DeclarePacket(PacketTypesGame.BALL_MOVE)
export class PacketPlayOutGameBallMove {
	constructor(
		public id: number,
		public size: number,
		public x: number,
		public y: number,
		public dir: number,
	) { }
}
