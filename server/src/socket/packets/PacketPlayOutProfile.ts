import { DeclarePacket, PacketTypesMisc } from "./packetTypes";

@DeclarePacket(PacketTypesMisc.PROFILE)
export class PacketPlayOutProfile {
	constructor(
		public nbMatchs: number,
		public matchWon: number,
		public history: Record<string, any>,
		public user: Record<string, any>,
	) { }
}
