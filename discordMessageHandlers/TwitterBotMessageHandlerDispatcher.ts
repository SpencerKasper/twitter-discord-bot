import {Message} from "discord.js";
import {COMMANDS} from "../static/twitter-bot-commands";
import {ListDiscordMessageHandler} from "./ListDiscordMessageHandler";
import {TwitterClient} from "../TwitterClient";

export class TwitterBotMessageHandlerDispatcher {
    private readonly message: Message;
    private listDiscordMessageHandler: ListDiscordMessageHandler;

    constructor(message, twitterClient: TwitterClient) {
        this.message = message;
        this.listDiscordMessageHandler = new ListDiscordMessageHandler(this.message, twitterClient);
    }

    async dispatch() {
        if (this.messageContainsACommand()) {
            this.listDiscordMessageHandler.handle();
        }
    }

    private messageContainsACommand() {
        return this.getMatchingTwitterBotCommands().length === 1;
    }

    private getMatchingTwitterBotCommands() {
        return COMMANDS.filter(command => this.message.content.startsWith(command.command));
    }
}