import { UserPreview } from "../interfaces/User";
import { Packet } from "./packetTypes";

export interface PacketPlayInUserSearchResults extends Packet {
	results: Array<UserPreview>;
}
