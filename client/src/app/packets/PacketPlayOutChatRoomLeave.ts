import { PacketOutChatRoom } from "./PacketOutChatRoom";
import { ChatPacketTypes, DeclarePacket } from "./packetTypes";

@DeclarePacket(ChatPacketTypes.LEAVE)
export class PacketPlayOutChatRoomLeave extends PacketOutChatRoom {}
