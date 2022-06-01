import { Player } from "../interfaces/Game.interface";
import { Packet } from "./packetTypes";

export interface PacketPlayInPlayerReady extends Packet {
	player: Player,
}
