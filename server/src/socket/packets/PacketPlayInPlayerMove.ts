import { Directions } from "src/game/game.interfaces";
import { Packet } from "./packetTypes";

export interface PacketPlayInPlayerMove extends Packet {
	direction: Directions,
}
