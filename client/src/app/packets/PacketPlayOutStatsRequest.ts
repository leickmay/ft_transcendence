import { DeclarePacket, PacketTypesMisc } from "./packetTypes";

@DeclarePacket(PacketTypesMisc.STATS_REQUEST)
export class PacketPlayOutStatsRequest { }
