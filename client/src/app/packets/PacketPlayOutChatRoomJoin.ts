import { PacketOutChatRoom } from "./PacketOutChatRoom";
import { ChatPacketTypes, DeclarePacket } from "./packetTypes";

@DeclarePacket(ChatPacketTypes.JOIN)
export class PacketPlayOutChatRoomJoin extends PacketOutChatRoom {}
