import { Player, Directions } from "src/game/game.interfaces";
import { DeclarePacket, PacketTypesPlayer } from "./packetTypes";

@DeclarePacket(PacketTypesPlayer.TELEPORT)
export class PacketPlayOutPlayerTeleport {
	constructor(
		public player: number,
		public direction: Directions,
		public x: number,
		public y: number,
	) { }
}
