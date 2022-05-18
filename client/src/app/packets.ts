export enum PacketInTypes {
	USER_CONNECTION,
	USER_DISCONNECTED,
	USER_UPDATE,
	TOTP_STATUS,
	MOVE,
}

export enum PacketOutTypes {
	TOTP,
	OPTION_UPDATE,
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

export interface PacketPlayInPlayerMove extends Packet {
	player: number,
	direction: Directions;
}

// =================================== \\
// ========== PacketPlayOut ========== \\
// =================================== \\

@DeclarePacket(PacketOutTypes.MOVE)
export class PacketPlayOutPlayerMove {
	constructor(
		public direction: Directions,
	) {}
}

@DeclarePacket(PacketOutTypes.TOTP)
export class PacketPlayOutTotpRequest {
	constructor(
		public action: 'toggle' | 'get',
	) {}
}

@DeclarePacket(PacketOutTypes.OPTION_UPDATE)
export class PacketPlayOutOptionUpdate {
	constructor(
		public option: UserOptions,
		public value: any,
	) {}
}
