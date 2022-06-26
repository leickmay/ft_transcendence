import { Packet } from "./packetTypes";

export interface PacketPlayInGameInvitation extends Packet {
	room: {
		id: number,
	};
	user: {
		id: number,
		login: string,
		name: string,
	};
}
