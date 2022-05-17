export enum PacketTypes {
	OPTION_UPDATE,
	TOTP_REQUEST,
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
	packet_id: PacketTypes;
}

export const DeclarePacket = (type: PacketTypes) => {
	return <T extends { new (...args: any[]): {} }>(constructor: T) => {
		return class extends constructor implements Packet {
			packet_id: PacketTypes = type;
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

@DeclarePacket(PacketTypes.MOVE)
export class PacketPlayOutPlayerMove {
	constructor(public direction: Directions) {}
}

@DeclarePacket(PacketTypes.TOTP_REQUEST)
export class PacketPlayOutTotpRequest {
	constructor(public action: 'toggle' | 'get') {}
}

@DeclarePacket(PacketTypes.OPTION_UPDATE)
export class PacketPlayOutOptionUpdate {
	constructor(public option: UserOptions, public value: any) {}
}
