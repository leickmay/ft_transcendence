import { createContext } from "react";
import { GameData } from "../interfaces/Game.interface";

export const GameDataContext = createContext<GameData | undefined>(undefined);
