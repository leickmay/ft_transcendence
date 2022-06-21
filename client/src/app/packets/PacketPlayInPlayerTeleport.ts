import { Player, Directions } from "../interfaces/Game.interface";
import { Packet } from "./packetTypes";

export interface PacketPlayInPlayerTeleport extends Packet {
	player: number;
	direction: Directions;
	x: number;
	y: number;
}
