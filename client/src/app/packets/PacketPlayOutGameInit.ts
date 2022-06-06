import { Directions } from "../interfaces/Game.interface";
import { DeclarePacket, PacketTypesGame, PacketTypesPlayer } from "./packetTypes";

@DeclarePacket(PacketTypesGame.INIT)
export class PacketPlayOutGameInit {
	constructor(
	) { }
}
