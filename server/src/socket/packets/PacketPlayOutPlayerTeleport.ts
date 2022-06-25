import { Player, Directions, Vector2 } from "src/game/game.interfaces";
import { DeclarePacket, PacketTypesPlayer } from "./packetTypes";

@DeclarePacket(PacketTypesPlayer.TELEPORT)
export class PacketPlayOutPlayerTeleport {
	constructor(
		public player: number,
		public location: Vector2,
		public direction: Directions,
	) { }
}
