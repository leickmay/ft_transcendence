import { DeclarePacket, PacketTypesChat } from "../packetTypes";


@DeclarePacket(PacketTypesChat.JOIN)
export class PacketPlayOutChatRoomJoin {}
