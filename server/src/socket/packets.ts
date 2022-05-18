import { User } from "src/user/user.entity";

export enum PacketInTypes {
	TOTP,
	OPTION_UPDATE,
	MOVE,
}

export enum PacketOutTypes {
	USER_CONNECTION,
	USER_DISCONNECTED,
	USER_UPDATE,
	TOTP_STATUS,
	MOVE,
}

export enum Directions {
	UP,
	DOWN,
}

export enum UserOptions {
	NAME,
}

export interface Packet {
	packet_id: PacketInTypes;
}

export interface PacketOut {
}

export const DeclarePacket = (type: PacketOutTypes) => {
	return <T extends { new (...args: any[]): {} }>(constructor: T) => {
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

// =================================== \\
// ========== PacketPlayOut ========== \\
// =================================== \\

@DeclarePacket(PacketOutTypes.MOVE)
export class PacketPlayOutPlayerMove implements PacketOut {
	constructor(
		public player: number,
		public direction: Directions,
	) {}
}

@DeclarePacket(PacketOutTypes.USER_CONNECTION)
export class PacketPlayOutUserConnection implements PacketOut {
	constructor(
		public users: Record<string, any>,
	) {}
}

@DeclarePacket(PacketOutTypes.USER_DISCONNECTED)
export class PacketPlayOutUserDisconnected implements PacketOut {
	constructor(
		public user: number,
	) {}
}

@DeclarePacket(PacketOutTypes.USER_UPDATE)
export class PacketPlayOutUserUpdate implements PacketOut {
	constructor(
		public user: any,
	) {}
}

@DeclarePacket(PacketOutTypes.TOTP_STATUS)
export class PacketPlayOutTotpStatus implements PacketOut {
	constructor(
		public status: 'enabled' | 'disabled',
		public totp?: string,
	) {}
}
