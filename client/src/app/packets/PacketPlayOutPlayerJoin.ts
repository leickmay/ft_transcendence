import { DeclarePacket, PacketTypesPlayer } from "./packetTypes";

@DeclarePacket(PacketTypesPlayer.JOIN)
export class PacketPlayOutPlayerJoin { }
