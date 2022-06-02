import { Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { PacketPlayInSearchUserRequest } from 'src/socket/packets/PacketPlayInSearchUserRequest';
import { PacketPlayOutSearchUserResults } from 'src/socket/packets/PacketPlayOutSearchUserResults';
import { Packet, PacketTypesMisc } from 'src/socket/packets/packetTypes';
import { User } from 'src/user/user.entity';
import { ILike } from 'typeorm';

@Injectable()
export class SearchService {

	constructor() { }

	dispatch(packet: Packet, user: User): void {
		switch (packet.packet_id) {
			case PacketTypesMisc.SEARCH_USER:
				this.searchUserHandler(packet as PacketPlayInSearchUserRequest, user);
				break;
		}
	}

	async searchUserHandler(packet: PacketPlayInSearchUserRequest, user: User): Promise<void> {
		user.send('search', new PacketPlayOutSearchUserResults(instanceToPlain(
			await User.find({
				select: ['id', 'name', 'login'],
				where: {
					login: ILike(`${packet.request}%`),
				},
				order: {
					login: 'ASC',
				},
				take: 10,
			})
		) as any));
	}
}
