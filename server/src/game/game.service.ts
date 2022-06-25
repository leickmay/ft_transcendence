import { forwardRef, Inject } from '@nestjs/common';
import { EventsService } from 'src/socket/events.service';
import { PacketPlayInPlayerJoin } from 'src/socket/packets/PacketPlayInPlayerJoin';
import { PacketPlayInPlayerMove } from 'src/socket/packets/PacketPlayInPlayerMove';
import { PacketPlayInGameOptions } from 'src/socket/packets/PacketPlayInGameOptions';
import { PacketPlayInPlayerReady } from 'src/socket/packets/PacketPlayInPlayerReady';
import { PacketPlayOutGameUpdate } from 'src/socket/packets/PacketPlayOutGameUpdate';
import { PacketPlayOutUserConnection } from 'src/socket/packets/PacketPlayOutUserConnection';
import { Packet, PacketTypesGame, PacketTypesPlayer } from 'src/socket/packets/packetTypes';
import { StatsService } from 'src/stats/stats.service';
import { User } from '../user/user.entity';
import { GameStatus, Player, Room } from "./game.interfaces";
import { PacketPlayInPlayerInvite } from 'src/socket/packets/PacketPlayInPlayerInvite';
import { PacketPlayOutGameInvitation } from 'src/socket/packets/PacketPlayOutGameInvitation';
import { use } from 'passport';

export class GameService {
	rooms: Array<Room> = new Array<Room>();
	privRooms: Array<Room> = new Array<Room>();
	waitList: Array<User> = new Array<User>();

	constructor(
		@Inject(forwardRef(() => EventsService))
		private eventsService: EventsService,
		@Inject(forwardRef(() => StatsService))
		private statsService: StatsService,
	) {
		setInterval(() => {
			let server = this.eventsService.getServer();
			while (this.waitList.length >= 2 && server) {
				let room = new Room(server, this.statsService);
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
			case PacketTypesGame.OPTIONS:
				this.handlePrivateRoom(packet as PacketPlayInGameOptions, user);
				break;
			case PacketTypesGame.INVITATION:
				this.handleInvite(packet as PacketPlayInPlayerInvite, user);
				break;
			default:
				break;
		}
	}

	onLeave(user: User): void {
		user.player?.leave()

		const index = this.waitList.indexOf(user);
		if (index > -1) {
			this.waitList.splice(index, 1);
		}
	}

	handleInvite(packet: PacketPlayInPlayerInvite, user: User): void {
		if (!packet.target)
			return;
		let target = this.eventsService.getUserById(packet.target);
		if (!target || !target.socket || target.player)
			return;
		let room = user.player?.room;
		if (!room) {
			room = new Room(this.eventsService.getServer()!, this.statsService)
			room.join(user);
			this.privRooms.push(room);
		}
		target.socket.emit('game', new PacketPlayOutGameInvitation(
			{
				id: room.id
			},
			{
				id: user.id,
				login: user.login,
				name: user.name,
			}
		));
	}

	handlePrivateRoom(packet: PacketPlayInGameOptions, user: User): void {
		if (!user.player && !this.waitList.includes(user)) {
			let room = new Room(this.eventsService.getServer()!, this.statsService);
			room.join(user);
			this.privRooms.push(room);
		}
	}

	handleJoin(packet: PacketPlayInPlayerJoin, user: User): void {
		if (!user.player && !this.waitList.includes(user)) {
			this.waitList.push(user);
			user.send("game", new PacketPlayOutGameUpdate({
				status: GameStatus.MATCHMAKING,
			}));
		}
	}

	handleReady(packet: PacketPlayInPlayerReady, user: User): void {
		let player: Player | null = user.player;

		if (player?.room.status === GameStatus.WAITING) {
			player.setReady();
			player.room.tryStart();
		}
	}

	handlePlayerMove(packet: PacketPlayInPlayerMove, user: User): void {
		if (packet.direction === undefined)
			return;
		let player: Player | null = user.player;

		if (player?.room.status === GameStatus.RUNNING) {
			player.direction = packet.direction;
		}
	}
}
