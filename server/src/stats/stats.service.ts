import { Injectable } from "@nestjs/common";
import { PacketPlayInStatsUpdate } from "src/socket/packets/PacketPlayInStatsUpdate";

import { User } from "src/user/user.entity";
import { AddStatsDto } from "./dto/add-stats.dto";
import { Stats } from "./stats.entity";
import { MatchResult, UserStats } from "./userStats";

@Injectable()
export class StatsService {
	
	constructor (
	) {}

	async addStat(packet: PacketPlayInStatsUpdate) : Promise<void> {
		const p1: User = await User.find({
			where: {
				id: packet.p1Id,
			}
		})[0];
		
		const p2: User = await User.find({
			where: {
				id: packet.p2Id,
			}
		})[0];
		const st: AddStatsDto = {
			winnerId: packet.winnerId,
			p1Id: packet.p1Id,
			p2Id: packet.p2Id,
		}
		await Stats.create(st as any).save();
	}

	async getStats(user: User): Promise<UserStats> {
		let userStatsp1 : Stats[] = await Stats.find({
			where: [
				{
					p1Id: user.id,
				}
			],
			relations: ["p2"],
		});
		let history: MatchResult[] = [];
		for(let i = 0; i < userStatsp1.length; i++){
			let w: string;
			if (userStatsp1[i].winnerId === user.id)
				w = user.name;
			else
				w = userStatsp1[i].p2.name;
			history.push({
				winner: w,
				p1: user.name,
				p2: userStatsp1[i].p2.name,
				date: userStatsp1[i].createdDate,
			});
		}
		
		let userStatsp2 : Stats[] = await Stats.find({
			where: [
				{
					p2Id: user.id,
				}
			],
			relations: ["p1"],
		});
		for(let i = 0; i < userStatsp2.length; i++){
			let w: string;
			if (userStatsp2[i].winnerId === user.id)
				w = user.name;
			else
				w = userStatsp2[i].p1.name;
			history.push({
				winner: w,
				p1: userStatsp2[i].p1.name,
				p2: user.name,
				date: userStatsp2[i].createdDate,
			});
		}

		const nbMatchs = history.length;
		const matchWon = history.filter(u => u.winner === user.name).length;

		return {
			nbMatchs: nbMatchs,
			matchWon: matchWon,
			history: history.sort((h, i) => h.date.getTime() - i.date.getTime()).reverse().slice(0, 10),
		}
	}
}
