import { DeclarePacket, PacketTypesGame } from "./packetTypes";

@DeclarePacket(PacketTypesGame.OPTIONS)
export class PacketPlayOutGameOptions {
	constructor(
		public speedMin: number,
		public speedMax: number,
		public height: number,
		public minimize: boolean,
		public minimization: number,
		public duration: number,
		public cooldown: number,
	) {}
}