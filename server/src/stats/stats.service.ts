import { Injectable } from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { PacketPlayInStatsUpdate } from "src/socket/packets/PacketPlayInStatsUpdate";
import { PacketPlayOutStatsUpdate } from "src/socket/packets/PacketPlayOutStatsUpdate";
import { User } from "src/user/user.entity";
import { Stats } from "./stats.entity";

@Injectable()
export class StatsService {

	constructor(
	) { }

	async addStat(packet: PacketPlayInStatsUpdate): Promise<void> {
		await Stats.create({
			winner: packet.winnerId,
			player1: { id: packet.p1Id },
			player2: { id: packet.p2Id },
		}).save();
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
			{
				nbMatchs: stats.length,
				matchWon: stats.filter(m => m.winner === user.id).length,
				history: instanceToPlain(stats.slice(0, 10))
			}
		));
	}
}
