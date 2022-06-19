import { User } from "../interfaces/User";
import { Packet } from "./packetTypes";

export interface PacketPlayInLeaderboard extends Packet {
	users: Array<User>;
}
