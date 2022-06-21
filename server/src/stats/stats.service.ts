import { Injectable } from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { PacketPlayInLeaderboard } from "src/socket/packets/PacketPlayInLeaderboard";
import { PacketPlayOutLeaderboard } from "src/socket/packets/PacketPlayOutLeaderboard";
import { PacketPlayOutStatsUpdate } from "src/socket/packets/PacketPlayOutStatsUpdate";
import { Packet, PacketTypesMisc } from "src/socket/packets/packetTypes";
import { User } from "src/user/user.entity";
import { Stats } from "./stats.entity";

@Injectable()
export class StatsService {

	constructor(
	) { }

	dispatch(packet: Packet, user: User): void {
		switch (packet.packet_id) {
			case PacketTypesMisc.LEADERBOARD:
				this.sendLeaderboard(packet as PacketPlayInLeaderboard, user);
				break;
			case PacketTypesMisc.STATS_REQUEST:
				this.sendStats(user);
				break;
		}
	}

	async addStat(player1: User, player2: User, winner: number): Promise<void> {
		await Stats.create({
			winner: winner,
			player1: { id: player1.id },
			player2: { id: player2.id },
		}).save();
		if (player1.socket)
			this.sendStats(player1);
		if (player2.socket)
			this.sendStats(player2);
	}

	async sendStats(user: User): Promise<void> {
		let stats: Stats[] = await Stats.find({
			where: [
				{
					player1: {
						id: user.id
					},
				},
				{
					player2: {
						id: user.id
					},
				},
			],
			relations: ['player1', 'player2'],
		});
		user.send('stats', new PacketPlayOutStatsUpdate(
			stats.length,
			stats.filter(m => m.winner === user.id).length,
			instanceToPlain(stats.slice(0, 10))
		));
	}

	async sendLeaderboard(packet: PacketPlayInLeaderboard, user: User): Promise<void> {
		if (packet.action === undefined)
			return;
		let field = 'matchWon';
		if (packet.action === 'played')
			field = 'nbMatch';
		if (packet.action === 'level')
			field = 'xp';
		let users = await User.find({
			order: {
				[field]: 'DESC',
			},
			take: 10,
		});
		user.send('stats', new PacketPlayOutLeaderboard(instanceToPlain(users)));
	}
}
