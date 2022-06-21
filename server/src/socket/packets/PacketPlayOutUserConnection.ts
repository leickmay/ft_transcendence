import { UserPreview } from "src/user/user.entity";
import { DeclarePacket, PacketTypesUser } from "./packetTypes";

@DeclarePacket(PacketTypesUser.CONNECTION)
export class PacketPlayOutUserConnection {
	constructor(
		public users: Array<UserPreview>,
	) { }
}
