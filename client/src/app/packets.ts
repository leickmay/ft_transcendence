export enum PacketInTypes {
	TOTP,
	USER_CONNECTION,
	USER_DISCONNECTED,
	USER_UPDATE,
	FRIENDS_UPDATE,
	MOVE,
}

export enum PacketOutTypes {
	TOTP,
	USER_UPDATE,
	MOVE,
	FRIENDS,
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
export class PacketPlayOutTotp {
	constructor(
		public action: 'toggle' | 'get',
	) {}
}

@DeclarePacket(PacketOutTypes.USER_UPDATE)
export class PacketPlayOutUserUpdate {
	constructor(
		public options: {[option: string]: any},
	) {}
}
