import { Directions } from "src/game/game.interfaces";
import { DeclarePacket, PacketTypesPlayer } from "./packetTypes";

@DeclarePacket(PacketTypesPlayer.MOVE)
export class PacketPlayOutPlayerMove {
	constructor(
		public user: number,
		public direction: Directions,
	) { }
}
