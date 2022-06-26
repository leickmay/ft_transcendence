import { DeclarePacket, PacketTypesGame } from "./packetTypes";

@DeclarePacket(PacketTypesGame.OPTIONS)
export class PacketPlayOutGameOptions {
	constructor(
		public speedMin: number,
		public speedMax: number,
		public height: number,
		public cowMode: boolean,
	) {}
}