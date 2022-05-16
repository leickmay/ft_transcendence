enum PacketOptionTypes {
	NAME,
}

interface OptionPacket {
	type: PacketOptionTypes;
}

declare module '*.jpeg';
declare module '*.png';
