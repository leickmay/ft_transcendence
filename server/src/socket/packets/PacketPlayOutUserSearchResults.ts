import { DeclarePacket, PacketTypesMisc } from "./packetTypes";

@DeclarePacket(PacketTypesMisc.SEARCH_USER)
export class PacketPlayOutUserSearchResults {
	constructor(
		public results: Array<{
			id: number,
			name: string,
			login: string,
		}>,
	) { }
}
