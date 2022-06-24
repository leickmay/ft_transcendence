import { createContext } from "react";
import { Ball, Player } from "../interfaces/Game.interface";

export const GameContext = createContext<{
	players: Array<Player>,
	setPlayers: React.Dispatch<React.SetStateAction<Array<Player>>>,
	balls: Array<Ball>,
	setBalls: React.Dispatch<React.SetStateAction<Array<Ball>>>,
}>({} as any);
