import { Player } from "../interfaces/Game.interface";
import { Packet } from "./packetTypes";

export interface PacketPlayInPlayerJoin extends Packet {
	player: Player;
}
