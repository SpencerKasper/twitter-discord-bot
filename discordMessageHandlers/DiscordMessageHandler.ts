import {Message} from "discord.js";
import {TwitterBotCommand} from "../static/twitter-bot-commands";

export interface DiscordMessageHandler {
    message: Message;
    command: TwitterBotCommand;
    handle: () => Promise<void>;
}