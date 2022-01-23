import { solutions } from "./solutions";
const wordle_epoch = new Date(2021, 5, 19, 0, 0, 0, 0).setHours(0, 0, 0, 0);
export function get_word(id: Date | number): string {
    if (typeof id === "object") {
        id = get_id(id);
    }
    return solutions[id % solutions.length];
}

export function get_id(date: Date): number {
    return Math.round((date.setHours(0, 0, 0, 0) - wordle_epoch) / 86400000);
}