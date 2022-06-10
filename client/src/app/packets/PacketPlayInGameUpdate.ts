import { GameData } from "../interfaces/Game.interface";
import { Packet } from "./packetTypes";

export interface PacketPlayInGameUpdate extends Packet {
	/**
	 * Partial data fields of the game
	 */
	data: Partial<GameData>;
}
