import { DeclarePacket, PacketTypesGame, PacketTypesPlayer } from "./packetTypes";

// For game props (like bonuses)
@DeclarePacket(PacketTypesGame.DESTROY)
export class PacketPlayOutRoomDestroy {}
