import { DeclarePacket, PacketTypesMisc, PacketTypesUser } from "./packetTypes";

@DeclarePacket(PacketTypesMisc.ALREADY_TAKEN)
export class PacketPlayOutAlreadyTaken {
	constructor(
		public name: string,
	) { }
}
