import { Ball } from "../interfaces/Game.interface";
import { Packet } from "./packetTypes";

export interface PacketPlayInGameBallMove extends Packet {
	id: number,
	size: number,
	x: number,
	y: number,
	dir: number,
}
