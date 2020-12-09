import {Message} from "discord.js";

export interface DiscordMessageParser {
    message: Message;
    parse: () => string;
}