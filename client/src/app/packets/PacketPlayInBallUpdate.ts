import { Vector2 } from "../interfaces/Game.interface";
import { Packet } from "./packetTypes";

export interface PacketPlayInBallUpdate extends Packet {
	ball: number,
	location?: Vector2,
	direction?: Vector2,
	size?: number,
	speed?: number,
}
