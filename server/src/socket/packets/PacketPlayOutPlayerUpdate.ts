import { Player } from "src/game/game.interfaces";
import { DeclarePacket, PacketTypesPlayer } from "./packetTypes";

@DeclarePacket(PacketTypesPlayer.UPDATE)
export class PacketPlayOutPlayerUpdate {
	constructor(
		public data: Record<string, any> | Partial<Player>,
	) { }
}
