import { Packet } from "./packetTypes";

export interface PacketPlayInPlayerJoinWL extends Packet {
	searching: boolean;
}
