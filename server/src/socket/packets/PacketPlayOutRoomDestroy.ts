import { DeclarePacket, PacketTypesGame } from "./packetTypes";

@DeclarePacket(PacketTypesGame.DESTROY)
export class PacketPlayOutRoomDestroy {}
