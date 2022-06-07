export class MatchResult {
	winner: string;
	p1: string;
	p2: string;
	date: Date;
}

export class UserStats {
	nbMatchs: number;
	matchWon: number;
	history: MatchResult[];
}