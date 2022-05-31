import { DeclarePacket, PacketTypesGame } from "./packetTypes";

// For game props (like bonuses)
@DeclarePacket(PacketTypesGame.UPDATE)
export class PacketPlayOutRoomUpdate {}
