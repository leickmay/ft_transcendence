import { MatchResult } from "../interfaces/Stats";
import { User } from "../interfaces/User";
import { Packet } from "./packetTypes";

export interface PacketPlayInProfile extends Packet {
	nbMatchs: number,
	matchWon: number,
	history: Array<MatchResult>,
	user: User,
}
