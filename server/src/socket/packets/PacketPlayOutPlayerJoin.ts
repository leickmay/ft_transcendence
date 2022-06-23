import { Player } from "src/game/game.interfaces";
import { User } from "src/user/user.entity";
import { DeclarePacket, PacketTypesPlayer } from "./packetTypes";

@DeclarePacket(PacketTypesPlayer.JOIN)
export class PacketPlayOutPlayerJoin {
	constructor(
		public player: Record<string, any> | Partial<Player>,
	) { }
}
