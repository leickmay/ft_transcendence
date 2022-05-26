import { User } from "../interfaces/User";
import { Packet } from "./packetTypes";

export interface PacketPlayInUserConnection extends Packet {
	users: Array<User>;
}