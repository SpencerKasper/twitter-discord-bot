import {Message} from "discord.js";
import {TwitterBotCommand} from "../twitter-bot-commands";

export interface DiscordMessageHandler {
    message: Message;
    command: TwitterBotCommand;
    handle: () => Promise<void>;
}