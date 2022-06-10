import { DeclarePacket, PacketTypesGame } from "./packetTypes";

@DeclarePacket(PacketTypesGame.START)
export class PacketPlayOutGameStatusStart { }
