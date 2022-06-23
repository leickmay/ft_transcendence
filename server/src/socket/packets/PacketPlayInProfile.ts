import { Packet } from "./packetTypes";

export interface PacketPlayInProfile extends Packet {
	login: string;
}