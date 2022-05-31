import { PacketOutChatRoom } from "./PacketOutChatRoom";
import { PacketTypesChat, DeclarePacket } from "./packetTypes";

@DeclarePacket(PacketTypesChat.LEAVE)
export class PacketPlayOutChatRoomLeave extends PacketOutChatRoom {}
