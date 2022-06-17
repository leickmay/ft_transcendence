import { MatchResult } from "../interfaces/Stats";
import { Packet } from "./packetTypes";

export interface PacketPlayInStatsUpdate extends Packet {
	nbMatchs: number,
	matchWon: number,
	history: Array<MatchResult>,
}
