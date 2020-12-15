import {Message} from "discord.js";

export interface DiscordMessageHandler {
    message: Message;
    handle: () => Promise<void>;
}