import { Player } from "src/game/game.interfaces";
import { DeclarePacket, PacketTypesPlayer } from "./packetTypes";

@DeclarePacket(PacketTypesPlayer.READY)
export class PacketPlayOutPlayerReady {
	constructor(
		public player: number,
	) { }
}
