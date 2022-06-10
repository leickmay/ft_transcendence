import { Packet } from "./packetTypes";

export interface PacketPlayInGameStatusStarting extends Packet {
	/**
	 * Time before the game start
	 */
	time: number,
}
