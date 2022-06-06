import { forwardRef, Inject } from '@nestjs/common';
import { EventsService } from 'src/socket/events.service';
import { PacketPlayInPlayerJoin } from 'src/socket/packets/PacketPlayInPlayerJoin';
import { PacketPlayInPlayerMove } from 'src/socket/packets/PacketPlayInPlayerMove';
import { PacketPlayInPlayerReady } from 'src/socket/packets/PacketPlayInPlayerReady';
import { PacketPlayOutGameUpdate } from 'src/socket/packets/PacketPlayOutGameUpdate';
import { PacketPlayOutPlayerJoinWL } from 'src/socket/packets/PacketPlayOutPlayerJoinWL';
import { Packet, PacketTypesGame, PacketTypesPlayer } from 'src/socket/packets/packetTypes';
import { User } from '../user/user.entity';
import { GameData, Player, Room } from "./game.interfaces";

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
			case PacketTypesGame.INIT:
				this.handleInitGame(user);
				break;
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

	handleInitGame(user: User) {
		let emptyBaseRoom = new Room(null);
		let newPacket: GameData = {
			id: emptyBaseRoom.id,
			height: emptyBaseRoom.height,
			width: emptyBaseRoom.width,
			full: emptyBaseRoom.isFull(),
			started: emptyBaseRoom.isRunning(),
			over: emptyBaseRoom.isOver,
			minPlayers: emptyBaseRoom.minPlayers,
			maxPlayers: emptyBaseRoom.maxPlayers,
			players: emptyBaseRoom.players,
			balls: emptyBaseRoom.balls,
		};
		console.log(newPacket);
		
		user.send("game", new PacketPlayOutGameUpdate(newPacket));
	}

	handleJoin(packet: PacketPlayInPlayerJoin, user: User): void {
		if (!user.player) {
			this.waitList.push(user);
			user.send("game",new PacketPlayOutPlayerJoinWL(true));
		}
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

		if (player && player.room.isRunning()) {
			player.direction = packet.direction;
		}
	}
}
