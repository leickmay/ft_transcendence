import { User } from "./User";

export interface MatchResult {
	winner: number,
	player1: User,
	player2: User,
	createdDate: Date,
}

export interface UserStats {
	nbMatchs: number,
	matchWon: number,
	history: MatchResult[],
}
