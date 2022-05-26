import { DeclarePacket, UserPacketTypes } from "../packetTypes";

@DeclarePacket(UserPacketTypes.USER_UPDATE)
export class PacketPlayOutUserUpdate {
	constructor(
		public options: {[option: string]: any},
	) {}
}
