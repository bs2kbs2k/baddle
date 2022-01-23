import { addInputListener, SpecialKey, Key } from "./input";
import { PersistantStorage } from "./storage";
import { CluedLetter, Clue, violation, clue, clueClass } from "./clues";
import { combinedWords } from "./combined_words";

const board = document.querySelector("#board");

class GameState {
  correctAnswer: string;
  _board: CluedLetter[][];
  hardMode: boolean;

  constructor(correctAnswer: string, hardMode: boolean) {
    this.correctAnswer = correctAnswer.toUpperCase();
    this.hardMode = hardMode;
    this._board = [[]];
  }

  public serialize(): string {
    return JSON.stringify(this);
  }

  public deserialize(data: string) {
    const state = JSON.parse(data);
    this.correctAnswer = state.correctAnswer;
    this._board = state._board;
    this.hardMode = state.hardMode;
    this._board.forEach((row, i) => {
      row.forEach((tile, j) => {
        board.children[i].children[j].textContent = tile.letter;
        if (tile.clue) {
          board.children[i].children[j].classList.add(clueClass(tile.clue));
        } else {
          board.children[i].children[j].classList.add("pending");
        }
      });
    });
  }

  // Verify if it's a valid guess
  public verify(): string {
    if (this._board.at(-1).length != 5) {
      return "Guess too short";
    }
    const guess = this._board.at(-1).map(e => e.letter).join("");
    if (!combinedWords.includes(guess.toLowerCase())) {
      return "Guess not in dictionary";
    }
    return violation(this._board.slice(0, -1).flat(), guess);
  }

  public type(key: Key) {
    let cursorPos = this._board.at(-1).length; // 0-indexed
    let linePos = this._board.length - 1;
    if (typeof key == "string") {
      if (this._board.at(-1).length <= 5) {
        board.children[linePos].children[cursorPos].textContent = key;
        board.children[linePos].children[cursorPos].classList.add("pending");
        this._board.at(-1).push({ letter: key });
      }
    } else {
      switch (key) {
        case SpecialKey.Backspace:
          if (cursorPos > 0) {
            board.children[linePos].children[cursorPos - 1].textContent = "";
            board.children[linePos].children[cursorPos - 1].classList.remove("pending");
            this._board.at(-1).pop();
          }
          break;
        case SpecialKey.Enter:
          if (cursorPos == 5) {
            let violation = this.verify();
            if (violation) {
              if (board.children[linePos].classList.contains("invalid")) {
                board.children[linePos].classList.remove("invalid");
                setTimeout(() => {
                  board.children[linePos].classList.add("invalid");
                }, 0);
              } else {
                board.children[linePos].classList.add("invalid");
              }
              const toast = document.querySelector("#toast");
              toast.textContent = violation;
              toast.classList.remove("hidden");
              setTimeout(() => {
                toast.classList.add("fade-out");
                setTimeout(() => {
                  toast.classList.remove("fade-out");
                  toast.classList.add("hidden");
                }, 100);
              }, 4000);
            } else {
              const guess = this._board.at(-1).map(e => e.letter).join("");
              this._board[this._board.length - 1] = clue(guess, this.correctAnswer);
              this._board.at(-1).forEach((tile, i) => {
                setTimeout(() => {
                  board.children[linePos].children[i].classList.add("flip-out");
                  setTimeout(() => {
                    board.children[linePos].children[i].classList.remove("flip-out");
                    board.children[linePos].children[i].classList.remove("pending");
                    board.children[linePos].children[i].classList.add(clueClass(tile.clue));
                    board.children[linePos].children[i].classList.add("flip-in");
                    setTimeout(() => {
                      board.children[linePos].children[i].classList.remove("flip-in");
                    }, 250);
                  }, 250);
                }, 250 * i);
              });
              if (guess == this.correctAnswer) {
                setTimeout(() => {
                  this._board.at(-1).forEach((tile, i) => {
                    setTimeout(() => {
                      board.children[linePos].children[i].classList.add("win");
                    }, 100 * i);
                  });
                }, 1250);
                window["gameState"].destroy();
                window["gameState"] = null;
              } else if (this._board.length == 6) {
                const toast = document.querySelector("#toast");
                toast.textContent = this.correctAnswer;
                toast.classList.remove("hidden");
                setTimeout(() => {
                  toast.classList.add("fade-out");
                  setTimeout(() => {
                    toast.classList.remove("fade-out");
                    toast.classList.add("hidden");
                  }, 100);
                }, 8000);
                window["gameState"].destroy();
                window["gameState"] = null;
              } else {
                this._board.push([]);
              }
            }
          }
          break;
      }
    }
  }
}

addInputListener((key) => {
  if (window["gameState"]) {
    window["gameState"].content.type(key);
  }
});

export function newGame(correctAnswer: string) {
  window["gameState"] = new PersistantStorage("gameState", new GameState(correctAnswer, window["gameSettings"].content.hardMode));
}

export function loadGame() {
  if (localStorage.getItem("gameState")) {
    window["gameState"] = new PersistantStorage("gameState", new GameState("aaaaa", false));
  }
}

export function abortGame() {
  if (window["gameState"]) {
    window["gameState"].destroy();
    window["gameState"] = null;
    [...board.children].forEach(row => {
      [...row.children].forEach(tile => {
        tile.textContent = "";
        tile.classList.forEach(entry => {
          if (entry != "tile") {
            tile.classList.remove(entry);
          }
        });
      });
    });
  }
}