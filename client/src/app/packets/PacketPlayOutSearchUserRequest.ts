import { DeclarePacket, PacketTypesMisc } from "./packetTypes";

@DeclarePacket(PacketTypesMisc.SEARCH_USER)
export class PacketPlayOutSearchUserRequest {
	constructor(
		public request: string,
	) { }
}
