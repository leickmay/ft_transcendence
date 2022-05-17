import { User } from "src/user/user.entity";

export enum PacketInTypes {
	TOTP_REQUEST,
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
	packet_id: PacketOutTypes;
}

export const DeclarePacket = (type: PacketOutTypes) => {
	return <T extends { new (...args: any[]): {} }>(constructor: T) => {
		return class extends constructor implements PacketOut {
			packet_id = type;
		}
	}
}

// =================================== \\
// ========== PacketPlayIn  ========== \\
// =================================== \\

export interface PacketPlayInTotpRequest extends Packet {
	action: 'toggle' | 'get',
}

// =================================== \\
// ========== PacketPlayOut ========== \\
// =================================== \\

@DeclarePacket(PacketOutTypes.MOVE)
export class PacketPlayOutPlayerMove {
	constructor(
		public player: number,
		public direction: Directions,
	) {}
}

@DeclarePacket(PacketOutTypes.USER_CONNECTION)
export class PacketPlayOutUserConnection {
	constructor(
		public users: Record<string, any>,
	) {}
}

@DeclarePacket(PacketOutTypes.USER_DISCONNECTED)
export class PacketPlayOutUserDisconnected {
	constructor(
		public user: number,
	) {}
}

@DeclarePacket(PacketOutTypes.USER_UPDATE)
export class PacketPlayOutUserUpdate {
	constructor(
		public user: any,
	) {}
}

@DeclarePacket(PacketOutTypes.TOTP_STATUS)
export class PacketPlayOutTotpStatus {
	constructor(
		public status: 'enabled' | 'disabled',
		public totp?: string,
	) {}
}
