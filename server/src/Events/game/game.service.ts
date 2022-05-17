import { User } from '../../user/user.entity';
import { Directions, GameEvents, GamePacket, IPlayer, Room } from "./game.interfaces"

export class gameService {
	rooms: Array<Room> = new Array;
	players: Array<IPlayer> = new Array;
	waitList: Array<IPlayer> = new Array;

	gameListener(packet: GamePacket): void {
		let user: User = packet.user
		let player: IPlayer = this.findPlayer(user);

		if (player) {
			switch (packet.id) {
				case GameEvents.MOVE: {
					this.move(packet, player);
					break;
				}
				default:
					break;
			}
		}
	}

	JoinWaitList(packet: GamePacket, player: IPlayer) {
		if (this.waitList.indexOf(player) === -1) {
			this.waitList.push(player);
		}
		else {
			//already in wait list
			return;
		}
		if (this.waitList.length > 1 && this.rooms.length < 42) {
			this.rooms.push(new Room);
			this.rooms[this.rooms.length - 1].p1 = this.waitList.shift();
			this.rooms[this.rooms.length - 1].p2 = this.waitList.shift();
			this.players.push(this.rooms[this.rooms.length - 1].p1);
			this.players.push(this.rooms[this.rooms.length - 1].p2);
			
		}
	}

	move(packet: GamePacket, player: IPlayer) {
		if (packet.direction == Directions.UP) {
			player.y--;
		}
		if (packet.direction == Directions.DOWN) {
			player.y++;
		}
	}

	findPlayer(user: User): IPlayer {
		this.players.forEach((player: IPlayer) => {
			if (user.login === player.user.login) {
				return player;
			}
		})
		return null;
	}

}
