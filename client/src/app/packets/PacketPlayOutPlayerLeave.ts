import { DeclarePacket, PacketTypesPlayer } from "./packetTypes";

@DeclarePacket(PacketTypesPlayer.LEAVE)
export class PacketPlayOutPlayerLeave { }
