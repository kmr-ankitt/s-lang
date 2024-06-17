import { Error } from "../Error/error";
import { Token } from "../Tokens/token";
import { TokenType } from "../Tokens/tokenType";

export class Lexer {
  private start: number = 0;
  private current: number = 0;
  private line: number = 1;
  private readonly tokens: Token[] = [];

  constructor(private readonly source: string) {}

  scanTokens(): Token[] {
    while (!this.isAtEnd) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
    return this.tokens;
  }

  //   Helper functions for scanToken()
  private advance() {
    return this.source.charAt(this.current++);
  }

  private addToken(type: TokenType): void;
  private addToken(type: TokenType, literal: any): void;
  private addToken(type: TokenType, literal?: any): void {
    if (literal === undefined) literal = null;
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) != expected) return false;
    this.current++;
    return true;
  }

  private peek(): string {
    if (this.isAtEnd()) return "\0";
    return this.source.charAt(this.current);
  }

	private string() : void{

		// Loop untill it finds " or gets at the end of line 
		while(this.peek() != '"' && !this.isAtEnd()){

			// If lexer is at new line 
			if(this.peek() == '\n')
				this.line++;
			this.advance();
		}

		// If lexer is not at the end
		if(this.isAtEnd()){
			Error.error(this.line, "Unterminated String." );
			return ;
		}
		
		this.advance();

		// It extracts the value between " " 
		const value : string = this.source.substring(this.start + 1 , this.current- 1)
		this.addToken(TokenType.STRING , value);
	}

  private scanToken(): void {
    const c: string = this.advance();

    switch (c) {
      // Operators
      case "(":
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ")":
        this.addToken(TokenType.RIGHT_PAREN);
        break;
      case "{":
        this.addToken(TokenType.LEFT_BRACE);
        break;
      case "}":
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      case ",":
        this.addToken(TokenType.COMMA);
        break;
      case ".":
        this.addToken(TokenType.DOT);
        break;
      case "-":
        this.addToken(TokenType.MINUS);
        break;
      case "+":
        this.addToken(TokenType.PLUS);
        break;
      case ";":
        this.addToken(TokenType.SEMICOLON);
        break;
      case "*":
        this.addToken(TokenType.STAR);
        break;

      // "/" needs special handling cus comments also have / in it
      case "/":
        // This is Comment logic: If current is not at new line and current is not at the end then current will skip that part of code
        if (this.match("/")) {
          while (this.peek() != "\n" && !this.isAtEnd()) this.advance();
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;

      // Custom operators
      case "!":
        this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case "=":
        this.addToken(
          this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL
        );
        break;
      case "<":
        this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case ">":
        this.addToken(
          this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER
        );
        break;

      // Space, tabs and new line
      case " ":
      case "\r":
      case "\t":
        break;
      case "\n":
        this.line++;
        break;

      // String literals
      case '"':
        this.string();
        break;

      // If character is not recognised it will throw this error
      default:
        Error.error(this.line, "Unexpected character.");
        break;
    }
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }
}