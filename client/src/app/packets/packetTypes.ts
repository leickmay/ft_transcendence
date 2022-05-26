export enum MiscPacketTypes {
	TOTP = 1,
	FRIENDS,
	PLAYER_MOVE,
}

export enum UserPacketTypes {
	USER_CONNECTION = 101,
	USER_DISCONNECTED,
	USER_UPDATE,
}

export enum ChatPacketTypes {
	COMMAND = 201,
	MESSAGE,
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

export const DeclarePacket = (type: PacketTypes) => {
	return <T extends { new(...args: any[]): {} }>(constructor: T) => {
		return class extends constructor {
			packet_id = type;
		}
	}
}
