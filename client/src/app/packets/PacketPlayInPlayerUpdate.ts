import { User } from "../interfaces/User";
import { Packet } from "./packetTypes";

export interface PacketPlayInPlayerUpdate extends Packet {
	data: Partial<User>;
}
