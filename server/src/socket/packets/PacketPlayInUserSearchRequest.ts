import { Packet } from "./packetTypes";

export interface PacketPlayInUserSearchRequest extends Packet {
	request: string;
}
