import { Player, Directions, Vector2 } from "../interfaces/Game.interface";
import { Packet } from "./packetTypes";

export interface PacketPlayInPlayerTeleport extends Packet {
	player: number;
	direction: Directions;
	location: { x: number, y: number };
}
