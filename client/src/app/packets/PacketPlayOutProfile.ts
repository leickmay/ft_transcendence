import { DeclarePacket, PacketTypesMisc } from "./packetTypes";

@DeclarePacket(PacketTypesMisc.PROFILE)
export class PacketPlayOutProfile {
	constructor(
		public login: string,
	) {}
}