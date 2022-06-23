import { Directions } from "../interfaces/Game.interface";
import { DeclarePacket, PacketTypesPlayer } from "./packetTypes";

@DeclarePacket(PacketTypesPlayer.MOVE)
export class PacketPlayOutPlayerMove {
	constructor(
		public direction: Directions,
	) { }
}
