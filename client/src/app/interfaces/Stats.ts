export interface MatchResult {
	winner: string,
	p1: string,
	p2: string,
	date: Date,
}

export interface UserStats {
	nbMatchs: number,
	matchWon: number,
	history: MatchResult[],
}