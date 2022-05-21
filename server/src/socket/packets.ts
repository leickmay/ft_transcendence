export enum PacketInTypes {
	TOTP,
	USER_UPDATE,
	PLAYER_MOVE,
	FRIENDS,
}

export enum PacketOutTypes {
	TOTP,
	USER_CONNECTION,
	USER_DISCONNECTED,
	USER_UPDATE,
	FRIENDS_UPDATE,
	PLAYER_MOVE,
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

export interface PacketPlayInTotp extends Packet {
}

export interface PacketPlayInOptionUpdate extends Packet {
	options: {
		[option: string]: any;
	};
}

export interface PacketPlayInFriend extends Packet {
	action: 'add' | 'remove' | 'get';
	id?: number;
}

// =================================== \\
// ========== PacketPlayOut ========== \\
// =================================== \\

@DeclarePacket(PacketOutTypes.PLAYER_MOVE)
export class PacketPlayOutPlayerMove implements PacketOut {
	constructor(
		public player: number,
		public direction: Directions,
	) { }
}

@DeclarePacket(PacketOutTypes.USER_CONNECTION)
export class PacketPlayOutUserConnection implements PacketOut {
	constructor(
		public users: Record<string, any>,
	) { }
}

@DeclarePacket(PacketOutTypes.USER_DISCONNECTED)
export class PacketPlayOutUserDisconnected implements PacketOut {
	constructor(
		public user: number,
	) { }
}

@DeclarePacket(PacketOutTypes.FRIENDS_UPDATE)
export class PacketPlayOutFriendsUpdate implements PacketOut {
	constructor(
		public friends: Record<string, any>,
	) { }
}

@DeclarePacket(PacketOutTypes.USER_UPDATE)
export class PacketPlayOutUserUpdate implements PacketOut {
	constructor(
		public user: any,
	) { }
}
