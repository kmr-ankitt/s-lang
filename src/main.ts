import * as fs from "fs";
import * as readline from "readline";
import { Lexer } from "./Lexer/lexer";

export default class Slang {
  static hadError: boolean = false;

//   This the core method 
  public static main(args: string[]): void {
    if (args.length > 1) {
      console.log("Usage: s-lang [script]");
      process.exit(64);
    } else if (args.length == 1) {
      this.runFile(args[0]);
    } else {
      this.runPrompt();
    }
  }

//   This make the run Slang as file 
  private static runFile(path: string): void {
    fs.readFile(path, (err, data) => {
      const content = data.toString();
      this.run(content);
      this.hadError = false;
    });

    if(this.hadError)
        process.exit(65);
  }

  private static runPrompt(): void {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "> ",
    });

    rl.prompt();

    // Readline is used here to reads line input from user
    rl.on("line", (line) => {
      this.runFile(line);
      rl.prompt();
    }).on("close", () => {
      console.log("Goodbye!");
      process.exit(0);
    });
  }

  private static run(source: string) {
    const lexer = new Lexer(source);
    const tokens = lexer.scanTokens();

    for (let token of tokens) {
      console.log(token);
    }
  }
}
