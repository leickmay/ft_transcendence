import { Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { EventsService } from 'src/socket/events.service';
import { PacketPlayInFriend } from 'src/socket/packets/PacketPlayInFriend';
import { PacketPlayInOptionUpdate } from 'src/socket/packets/PacketPlayInOptionUpdate';
import { PacketPlayInTotp } from 'src/socket/packets/PacketPlayInTotp';
import { PacketPlayOutAlreadyTaken } from 'src/socket/packets/PacketPlayOutAlreadyTaken';
import { PacketPlayOutFriendsUpdate } from 'src/socket/packets/PacketPlayOutFriendsUpdate';
import { PacketPlayOutUserUpdate } from 'src/socket/packets/PacketPlayOutUserUpdate';
import { PacketTypesMisc, Packet, PacketTypesUser } from 'src/socket/packets/packetTypes';
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
			case PacketTypesUser.UPDATE:
				this.optionHandler(packet as PacketPlayInOptionUpdate, user);
				break;
			case PacketTypesMisc.TOTP:				
				this.totpHandler(packet as PacketPlayInTotp, user);
				break;
			case PacketTypesMisc.FRIENDS:
				this.friendHandler(packet as PacketPlayInFriend, user);
				break;
		}
	}

	async optionHandler(packet: PacketPlayInOptionUpdate, user: User): Promise<void> {
		let validated: Partial<User> = {};
		if (typeof packet.options['name'] === 'string') {
			let name: string = packet.options['name'];
			name = name.replace(/ +/, ' ').trim();
			if (name.length <= 20 && /^[A-Za-zÀ-ÖØ-öø-ÿ]+(( |-)?[A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(name)) {
				const target = await User.findOneBy({name: name});
				if (!target)
					validated.name = name;
				
			}
		}

		if (Object.keys(validated).length) {
			await User.update(user.id, validated);
			this.eventService.getServer()?.emit('user', new PacketPlayOutUserUpdate({
				id: user.id,
				...validated,
			}));
		}
		else {
			user.send('user', new PacketPlayOutAlreadyTaken(packet.options['name']));
		}
	}

	async totpHandler(packet: PacketPlayInTotp, user: User): Promise<void> {
		let url: string | null;
		url = await this.userService.toggleTotp(user);
		user.send('user', new PacketPlayOutUserUpdate({
			id: user.id,
			totp: url || false,
		}));
	}

	async friendHandler(packet: PacketPlayInFriend, user: User): Promise<void> {
		let friends = await user.friends;

		if (packet.action === 'add' || packet.action === 'remove') {
			if (packet.action == 'add') {
				if (packet.id !== user.id && !friends.find(e => e.id === packet.id)) {
					let target = await User.findOneBy({ id: packet.id });
					if (target) {
						friends.push(target);
					}
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
