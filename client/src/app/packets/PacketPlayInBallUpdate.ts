import { Packet } from "./packetTypes";

export interface PacketPlayInBallUpdate extends Packet {
	ball: number,
	direction?: { x: number, y: number },
	size?: number,
	speed?: number,
	x?: number,
	y?: number,
}
