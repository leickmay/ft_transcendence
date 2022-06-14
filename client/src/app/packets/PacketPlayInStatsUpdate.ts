import { MatchResult, UserStats } from "../interfaces/Stats";
import { Packet } from "./packetTypes";

export interface PacketPlayInStatsUpdate extends Packet {
	stats: UserStats;
}
