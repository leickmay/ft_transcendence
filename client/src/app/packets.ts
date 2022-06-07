import { UserStats } from "./interfaces/Stats";
import { UpdateUserDto, User } from "./interfaces/User";

export enum PacketInTypes {
	TOTP,
	USER_CONNECTION,
	USER_DISCONNECTED,
	USER_UPDATE,
	FRIENDS_UPDATE,
	PLAYER_MOVE,
	STATS_UPDATE,
}

export enum PacketOutTypes {
	TOTP,
	USER_UPDATE,
	PLAYER_MOVE,
	FRIENDS,
	STATS_UPDATE,
}

export enum Directions {
	UP,
	DOWN,
}

export interface Packet {
	packet_id: PacketInTypes;
}

export interface PacketOut {
}

export const DeclarePacket = (type: PacketOutTypes) => {
	return <T extends { new(...args: any[]): {} }>(constructor: T) => {
		return class extends constructor {
			packet_id = type;
		}
	}
}

// =================================== \\
// ========== PacketPlayIn  ========== \\
// =================================== \\

export interface PacketPlayInPlayerMove extends Packet {
	player: number,
	direction: Directions;
}

export interface PacketPlayInUserConnection extends Packet {
	users: Array<number>;
}

export interface PacketPlayInUserDisconnected extends Packet {
	user: number;
}

export interface PacketPlayInUserUpdate extends Packet {
	user: UpdateUserDto;
}

export interface PacketPlayInFriendsUpdate extends Packet {
	friends: Array<User>;
}

export interface PacketPlayInStatsUpdate extends Packet {
	stats: UserStats;
}

// =================================== \\
// ========== PacketPlayOut ========== \\
// =================================== \\

@DeclarePacket(PacketOutTypes.TOTP)
export class PacketPlayOutTotp {
}

@DeclarePacket(PacketOutTypes.PLAYER_MOVE)
export class PacketPlayOutPlayerMove {
	constructor(
		public direction: Directions,
	) {}
}

@DeclarePacket(PacketOutTypes.USER_UPDATE)
export class PacketPlayOutUserUpdate {
	constructor(
		public options: {[option: string]: any},
	) {}
}

@DeclarePacket(PacketOutTypes.FRIENDS)
export class PacketPlayOutFriends {
	constructor(
		public action: 'add' | 'remove' | 'get',
		public id?: number,
	) {}
}

@DeclarePacket(PacketOutTypes.STATS_UPDATE)
export class PacketPlayOutStatsUpdate {
	constructor (
		public winnerId: number,
		public p1Id: number,
		public p2Id: number,
		public id: number,
	) {}
}