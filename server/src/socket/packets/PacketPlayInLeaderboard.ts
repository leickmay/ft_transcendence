import { Packet } from "./packetTypes";

export interface PacketPlayInLeaderboard extends Packet {
	action: 'played' | 'won' | 'level',
}
