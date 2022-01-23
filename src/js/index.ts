import "./settings";
import "./overlay";
import { newGame } from "./common_game";
import { solutions } from "./solutions";
newGame(solutions[Math.floor(Math.random() * solutions.length)]);