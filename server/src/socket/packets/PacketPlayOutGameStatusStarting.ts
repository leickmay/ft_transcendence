import { DeclarePacket, PacketTypesGame } from "./packetTypes";

@DeclarePacket(PacketTypesGame.STARTING)
export class PacketPlayOutGameStatusStarting {
	constructor(
		public time: number,
	) { }
}
