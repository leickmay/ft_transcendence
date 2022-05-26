import { User } from "../interfaces/User";
import { Packet } from "./packetTypes";

export interface PacketPlayInFriendsUpdate extends Packet {
	friends: Array<User>;
}
