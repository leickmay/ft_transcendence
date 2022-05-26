import { DeclarePacket, MiscPacketTypes } from "./packetTypes";

@DeclarePacket(MiscPacketTypes.TOTP)
export class PacketPlayOutTotp {
}
