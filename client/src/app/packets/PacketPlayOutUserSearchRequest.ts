import { DeclarePacket, PacketTypesMisc } from "./packetTypes";

@DeclarePacket(PacketTypesMisc.SEARCH_USER)
export class PacketPlayOutUserSearchRequest {
	constructor(
		public request: string,
	) { }
}
