import { Player, Directions } from "../interfaces/Game.interface";
import { Packet } from "./packetTypes";

export interface PacketPlayInPlayerMove extends Packet {
	player: Player,
}
