import { GameData } from "src/game/game.interfaces";
import { DeclarePacket, PacketTypesGame } from "./packetTypes";

// For game props (like bonuses)
@DeclarePacket(PacketTypesGame.UPDATE)
export class PacketPlayOutGameUpdate {
	constructor(
		public data: Record<string, any>,
	) { }
}
