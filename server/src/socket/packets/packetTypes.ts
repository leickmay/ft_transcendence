export enum MiscPacketTypes {
	TOTP = 1,
	FRIENDS,
	PLAYER_MOVE,
}

export enum UserPacketTypes {
	CONNECTION = 101,
	DISCONNECTED,
	UPDATE,
}

export enum ChatPacketTypes {
	COMMAND = 201,
    MESSAGE,
    LIST,
	CREATE,
    JOIN,
	UP,
    QUIT,
    DELETE,
}

export type PacketTypes = MiscPacketTypes | UserPacketTypes | ChatPacketTypes;

export enum Directions {
	UP,
	DOWN,
}

export interface Packet {
	packet_id: PacketTypes;
}

export interface PacketOut {
}

export const DeclarePacket = (type: PacketTypes) => {
	return <T extends { new(...args: any[]): {} }>(constructor: T) => {
		return class extends constructor {
			packet_id = type;
		}
	}
}
