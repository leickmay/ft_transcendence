import { DeclarePacket, PacketTypesMisc } from "./packetTypes";

@DeclarePacket(PacketTypesMisc.SEARCH_USER)
export class PacketPlayOutSearchUserResults {
	constructor(
		public results: Array<{
			id: number,
			name: string,
			login: string,
		}>,
	) { }
}
