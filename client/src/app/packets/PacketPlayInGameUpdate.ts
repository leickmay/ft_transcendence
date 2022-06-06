import { GameData } from "../interfaces/Game.interface";
import { Packet } from "./packetTypes";

export interface PacketPlayInGameUpdate extends Packet {
	data: GameData;
}
