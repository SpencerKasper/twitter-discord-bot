import {DiscordMessageHandler} from "./DiscordMessageHandler";
import {Message} from "discord.js";
import {DiscordMessageParser} from "../messageParsers/DiscordMessageParser";

export class RetweetAlertDiscordMessageHandler implements DiscordMessageHandler {
    message: Message;
    messageParser: DiscordMessageParser;

    handle(): void {

    }
}