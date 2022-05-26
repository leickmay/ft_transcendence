import { Packet } from "./packetTypes";

export interface PacketPlayInFriend extends Packet {
	action: 'add' | 'remove' | 'get';
	id?: number;
}
