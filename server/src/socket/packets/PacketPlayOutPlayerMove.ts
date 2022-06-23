import { Player, Directions } from "src/game/game.interfaces";
import { DeclarePacket, PacketTypesPlayer } from "./packetTypes";

@DeclarePacket(PacketTypesPlayer.MOVE)
export class PacketPlayOutPlayerMove {
	constructor(
		public player: number,
		public direction: Directions,
	) { }
}
