import { Packet } from "../packetTypes";

export interface PacketPlayInOptionUpdate extends Packet {
	options: {
		[option: string]: any;
	};
}
