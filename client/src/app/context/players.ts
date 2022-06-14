import { createContext } from "react";
import { Player } from "../interfaces/Game.interface";

export const PlayersContext = createContext<[Array<Player>, React.Dispatch<React.SetStateAction<Array<Player>>>]>([[], undefined as any]);
