import { UserPreview } from "../interfaces/User";
import { Packet } from "./packetTypes";

export interface PacketPlayInSearchUserResults extends Packet {
	results: Array<UserPreview>;
}
