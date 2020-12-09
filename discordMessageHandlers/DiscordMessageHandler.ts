import {Message} from "discord.js";
import {DiscordMessageParser} from "../messageParsers/DiscordMessageParser";

export interface DiscordMessageHandler {
    message: Message;
    messageParser: DiscordMessageParser;
    handle: () => void;
}