import { Injectable } from '@nestjs/common';
import { Packet, PacketInTypes, PacketPlayInTotp, PacketPlayOutTotpStatus } from 'src/socket/packets';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OptionsService {

	constructor(
		private userService: UserService,
	) { }

	dispatch(packet: Packet, user: User): void {
		switch (packet.packet_id) {
			case PacketInTypes.OPTION_UPDATE:
				break;
			case PacketInTypes.TOTP:

				break;
			// case PacketInTypes.FRIEND:
			// 	break;
		}
	}

	async totpHandler(packet: PacketPlayInTotp, user: User): Promise<void> {
		let url: string | undefined;
		url = await this.userService.toggleTotp(user);
		user.send('totp', new PacketPlayOutTotpStatus(url ? 'enabled' : 'disabled', url));
	}

	// async friendEvent(packet: Packet, ): Promise<void> {
	// 	let user = this.eventsService.users[client.id];
	// 	if (!user)
	// 		return;

	// 	let friends = await user.friends;
	// 	if (action == 'add') {
	// 		let target = await User.findOneBy({id});

	// 		if (target && !friends.find(o => o.id === id)) {
	// 			friends.push(target);
	// 		}

	// 		user.friends = Promise.resolve(friends);
	// 		await (await user.save()).reload();
	// 	} else if (action == 'remove') {
	// 		friends = friends.filter(e => e.id != id);

	// 		user.friends = Promise.resolve(friends);
	// 		await (await user.save()).reload();
	// 	} else if (action == 'get') {
	// 	}
	// 	client.emit('friends', instanceToPlain(await user.friends));
	// }
}
