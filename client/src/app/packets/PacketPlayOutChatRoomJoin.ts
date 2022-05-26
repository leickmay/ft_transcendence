import { PacketOutChatRoom } from "./PacketOutChatRoom";
import { PacketTypesChat, DeclarePacket } from "./packetTypes";

@DeclarePacket(PacketTypesChat.JOIN)
export class PacketPlayOutChatRoomJoin extends PacketOutChatRoom {}
