import { Directions, Packet } from "../packetTypes";

export interface PacketPlayInPlayerMove extends Packet {
	player: number,
	direction: Directions;
}
