export enum PacketTypesMisc {
	TOTP = 1,
	FRIENDS,
	PLAYER_MOVE,
	SEARCH_USER,
	STATS_UPDATE,
	STATS_REQUEST,
	LEADERBOARD,
	PROFILE,
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
	LEAVE,
	UP,
	INIT,
	DEL,
	OPERATOR,
	BLOCK,
}

export enum PacketTypesGame {
	UPDATE = 401,
	MATCHMAKING,
	DESTROY,
	STARTING,
	START,
	SPECTATE,
}

export enum PacketTypesPlayer {
	JOIN = 411,
	UPDATE,
	READY,
	MOVE,
	TELEPORT,
	LIST,
}

export enum PacketTypesBall {
	UPDATE = 421,
}

export type PacketTypes = PacketTypesMisc | PacketTypesUser | PacketTypesChat | PacketTypesGame | PacketTypesPlayer | PacketTypesBall;

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
