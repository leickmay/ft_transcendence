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
		/*const p1: User = await User.find({
			where: {
				id: packet.p1Id,
			}
		})[0];

		const p2: User = await User.find({
			where: {
				id: packet.p2Id,
			}
		})[0];*/
		await Stats.create({
			winnerId: packet.winnerId,
			p1Id: packet.p1Id,
			p2Id: packet.p2Id,
		} as any).save();
	}

	async sendStats(user: User): Promise<void> {
		let stats: Stats[] = await Stats.find({
			where: [
				{
					p1Id: user.id,
				},
				{
					p2Id: user.id,
				},
			],
			relations: ['p1', 'p2'],
		});
		user.send('stats', new PacketPlayOutStatsUpdate(
			{
				nbMatchs: stats.length,
				matchWon: stats.filter(m => m.winnerId === user.id).length,
				history: instanceToPlain(stats.slice(0, 10))
			}
		));
	}
}
