import { Packet } from "./packetTypes";

export interface PacketPlayInGameSpectateRequest extends Packet {
	target: number;
}