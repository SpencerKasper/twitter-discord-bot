export interface DiscordMessageParser {
    getCommand: () => string;
    getArguments: () => string[];
}