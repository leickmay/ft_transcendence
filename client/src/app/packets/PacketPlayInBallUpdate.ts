import { Vector2 } from "../interfaces/Game.interface";
import { Packet } from "./packetTypes";

export interface PacketPlayInBallUpdate extends Packet {
	ball: number,
	location?: { x: number, y: number },
	direction?: { x: number, y: number },
	size?: number,
	speed?: number,
}
