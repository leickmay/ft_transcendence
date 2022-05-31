import { forwardRef, Inject } from '@nestjs/common';
import { EventsService } from 'src/socket/events.service';
import { PacketPlayInPlayerJoin } from 'src/socket/packets/PacketPlayInPlayerJoin';
import { PacketPlayInPlayerMove } from 'src/socket/packets/PacketPlayInPlayerMove';
import { PacketPlayInPlayerReady } from 'src/socket/packets/PacketPlayInPlayerReady';
import { Packet, PacketTypesPlayer } from 'src/socket/packets/packetTypes';
import { User } from '../user/user.entity';
import { Player, Room } from "./game.interfaces";

export class GameService {
	rooms: Array<Room> = new Array;
	privRooms: Array<Room> = new Array;
	waitList: Array<User> = new Array;

	constructor(
		@Inject(forwardRef(() => EventsService))
		private eventsService: EventsService,
	) {
		setInterval(() => {
			while (this.waitList.length >= 2 && eventsService.getServer()) {
				let room = new Room(eventsService.getServer());
				room.join(this.waitList.shift()!);
				room.join(this.waitList.shift()!);
				this.rooms.push(room);
			}
		}, 2000);
	}

	dispatch(packet: Packet, user: User) {
		switch (packet.packet_id) {
			case PacketTypesPlayer.JOIN:
				this.handleJoin(packet as PacketPlayInPlayerJoin, user);
				break;
			case PacketTypesPlayer.READY:
				this.handleReady(packet as PacketPlayInPlayerReady, user);
				break;
			case PacketTypesPlayer.MOVE:
				this.handlePlayerMove(packet as PacketPlayInPlayerMove, user);
				break;
			default:
				break;
		}
	}

	onLeave(user: User): void {
		this.destroyRoom(user.player?.room);

		const index = this.waitList.indexOf(user);
		if (index > -1) {
			this.waitList.splice(index, 1);
		}
	}

	destroyRoom(room: Room | undefined): void {
		room?.clear();
	}

	handleJoin(packet: PacketPlayInPlayerJoin, user: User): void {
		if (!user.player)
			this.waitList.push(user);
	}

	handleReady(packet: PacketPlayInPlayerReady, user: User): void {
		let player: Player | null = user.player;

		if (player && !player.room.isRunning()) {
			player.setReady();
			player.room.tryStart();
		}
	}

	handlePlayerMove(packet: PacketPlayInPlayerMove, user: User): void {
		let player: Player | null = user.player;

		if (player && !player.room.isRunning()) {
			player.direction = packet.direction;
		}
	}
}
