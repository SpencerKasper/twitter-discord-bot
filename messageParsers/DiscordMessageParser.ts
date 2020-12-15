export interface DiscordMessageParser {
    parse: () => string;
    getCommand: () => string;
}