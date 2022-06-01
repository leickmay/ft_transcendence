import { DeclarePacket, PacketTypesChat } from "../packetTypes";

@DeclarePacket(PacketTypesChat.LEAVE)
export class PacketPlayOutChatRoomLeave {}
