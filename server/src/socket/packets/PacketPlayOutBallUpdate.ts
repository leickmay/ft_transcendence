import { Vector2 } from "src/game/game.interfaces";
import { DeclarePacket, PacketTypesBall } from "./packetTypes";

@DeclarePacket(PacketTypesBall.UPDATE)
export class PacketPlayOutBallUpdate {
	constructor(
		public ball: number,
		public location?: Vector2,
		public direction?: Vector2,
		public size?: number,
		public speed?: number,
	) { }
}
