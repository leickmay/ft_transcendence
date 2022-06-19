import { UserPreview } from "../interfaces/User";
import { Packet } from "./packetTypes";

export interface PacketPlayInUserDisconnected extends Packet {
	user: UserPreview;
}
