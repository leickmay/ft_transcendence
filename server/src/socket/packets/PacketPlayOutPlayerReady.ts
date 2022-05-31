import { DeclarePacket, PacketTypesPlayer } from "./packetTypes";

@DeclarePacket(PacketTypesPlayer.READY)
export class PacketPlayOutPlayerReady {
	constructor(
		public user: number,
	) { }
}
