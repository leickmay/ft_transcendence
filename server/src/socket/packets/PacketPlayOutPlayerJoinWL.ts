import { DeclarePacket, PacketTypesPlayer } from "./packetTypes";

@DeclarePacket(PacketTypesPlayer.JOINWL)
export class PacketPlayOutPlayerJoinWL {
	constructor(
		public searching: boolean,
	) { }
}