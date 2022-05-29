import { Packet } from "./packetTypes";

export interface PacketPlayInSearchUserRequest extends Packet {
	request: string;
}
