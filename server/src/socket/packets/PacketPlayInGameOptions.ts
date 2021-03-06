import { Packet } from "./packetTypes";

export interface PacketPlayInGameOptions extends Packet {
	speedMin: number;
	speedMax: number;
	height: number;
	cowMode: boolean;
}
