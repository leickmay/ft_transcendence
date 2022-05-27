export enum PacketTypesMisc {
	TOTP = 1,
	FRIENDS,
	PLAYER_MOVE,
}

export enum PacketTypesUser {
	CONNECTION = 101,
	DISCONNECTED,
	UPDATE,
}

export enum PacketTypesChat {
	COMMAND = 201,
    MESSAGE,
    LIST,
	CREATE,
    JOIN,
	UP,
    QUIT,
    DELETE,
}

export type PacketTypes = PacketTypesMisc | PacketTypesUser | PacketTypesChat;

export enum Directions {
	UP,
	DOWN,
}

export interface Packet {
	packet_id: PacketTypes;
}

export const DeclarePacket = (type: PacketTypes) => {
	return <T extends { new(...args: any[]): {} }>(constructor: T) => {
		return class extends constructor {
			packet_id = type;
		}
	}
}
