import { User } from "./User";

export interface MatchResult {
	winnerId: number,
	p1: User,
	p2: User,
	createdDate: Date,
}

export interface UserStats {
	nbMatchs: number,
	matchWon: number,
	history: MatchResult[],
}
