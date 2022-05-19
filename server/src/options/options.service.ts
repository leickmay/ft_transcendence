import { Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { EventsService } from 'src/socket/events.service';
import { Packet, PacketInTypes, PacketPlayInFriend, PacketPlayInOptionUpdate, PacketPlayInTotp, PacketPlayOutFriendsUpdate, PacketPlayOutTotp, PacketPlayOutUserUpdate } from 'src/socket/packets';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OptionsService {

	constructor(
		private eventService: EventsService,
		private userService: UserService,
	) { }

	dispatch(packet: Packet, user: User): void {
		switch (packet.packet_id) {
			case PacketInTypes.USER_UPDATE:
				this.optionHandler(packet as PacketPlayInOptionUpdate, user);
				break;
			case PacketInTypes.TOTP:
				this.totpHandler(packet as PacketPlayInTotp, user);
				break;
			case PacketInTypes.FRIENDS:
				this.friendHandler(packet as PacketPlayInFriend, user);
				break;
		}
	}

	async optionHandler(packet: PacketPlayInOptionUpdate, user: User): Promise<void> {
		let validated = {};
		if (packet.options['name'])
			user.name = validated['name'] = packet.options['name'];

		user.save();
		this.eventService.getServer().emit('user', new PacketPlayOutUserUpdate({
			id: user.id,
			...validated,
		}))
	}

	async totpHandler(packet: PacketPlayInTotp, user: User): Promise<void> {
		let url: string | undefined;
		url = await this.userService.toggleTotp(user);
		user.send('user', new PacketPlayOutTotp(url ? 'enabled' : 'disabled', url));
	}

	async friendHandler(packet: PacketPlayInFriend, user: User): Promise<void> {
		let friends = await user.friends;
		if (packet.action === 'add' || packet.action === 'remove') {
			if (packet.action == 'add') {
				let target = await User.findOneBy({ id: packet.id });
				if (target && friends.find(e => e.id !== packet.id)) {
					friends.push(target);
				}
			} else {
				friends = friends.filter(e => e.id !== packet.id);
			}
			user.friends = Promise.resolve(friends);
			await user.save();
		}
		user.send('user', new PacketPlayOutFriendsUpdate(instanceToPlain(friends)));
	}
}
