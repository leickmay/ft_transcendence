import { Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { EventsService } from 'src/socket/events.service';
import { PacketPlayInFriend } from 'src/socket/packets/PacketPlayInFriend';
import { PacketPlayInOptionUpdate } from 'src/socket/packets/PacketPlayInOptionUpdate';
import { PacketPlayInSearchUserRequest } from 'src/socket/packets/PacketPlayInSearchUserRequest';
import { PacketPlayInTotp } from 'src/socket/packets/PacketPlayInTotp';
import { PacketPlayOutFriendsUpdate } from 'src/socket/packets/PacketPlayOutFriendsUpdate';
import { PacketPlayOutSearchUserResults } from 'src/socket/packets/PacketPlayOutSearchUserResults';
import { PacketPlayOutUserUpdate } from 'src/socket/packets/PacketPlayOutUserUpdate';
import { PacketTypesMisc, Packet, PacketTypesUser } from 'src/socket/packets/packetTypes';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SearchService {

	constructor(
		private eventService: EventsService,
		private userService: UserService,
	) { }

	dispatch(packet: Packet, user: User): void {
		switch (packet.packet_id) {
			case PacketTypesMisc.SEARCH_USER:
				this.searchUserHandler(packet as PacketPlayInSearchUserRequest, user);
				break;
		}
	}

	async searchUserHandler(packet: PacketPlayInSearchUserRequest, user: User): Promise<void> {
		user.send('user', new PacketPlayOutSearchUserResults(instanceToPlain(
			User.find({
				where: {
					login: '...',
				},
			})
		)));
	}
}
