import {Message} from "discord.js";
import {COMMANDS} from "../static/twitter-bot-commands";

export class TwitterBotMessageHandlerDispatcher {
    private readonly message: Message;

    constructor(message) {
        this.message = message;
    }

    async dispatch() {
        if (this.messageContainsACommand()) {
            // new TopTwitterSearchResultDiscordMessageHandler(
            //     this.message
            // ).handle();
        }
    }

    private messageContainsACommand() {
        return this.getMatchingTwitterBotCommands().length === 1;
    }

    private getMatchingTwitterBotCommands() {
        return COMMANDS.filter(command => this.message.content.startsWith(command.command));
    }
}