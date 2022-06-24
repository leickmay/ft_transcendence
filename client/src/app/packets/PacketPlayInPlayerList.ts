import { Player } from "../interfaces/Game.interface";
import { Packet } from "./packetTypes";

export interface PacketPlayInPlayerList extends Packet {
	players: Array<Player>;
}
