import { DeclarePacket, PacketTypesGame } from "./packetTypes";

@DeclarePacket(PacketTypesGame.INVITATION)
export class PacketPlayOutGameInvitation {
	constructor(
		public room: {
			id: number,
		},
		public user: {
			id: number,
			login: string,
			name: string,
		},
	) {}
}
