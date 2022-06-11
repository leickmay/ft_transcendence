import { PacketTypesChat, DeclarePacket } from "./packetTypes";

@DeclarePacket(PacketTypesChat.JOIN)
export class PacketPlayOutChatRoomJoin {}
