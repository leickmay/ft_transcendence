import { UpdateUserDto } from "../../interfaces/User";
import { Packet } from "../packetTypes";

export interface PacketPlayInUserUpdate extends Packet {
	user: UpdateUserDto;
}
