import {Message} from "discord.js";
import {COMMANDS} from "../static/twitter-bot-commands";
import {ListDiscordMessageHandler} from "./ListDiscordMessageHandler";
import {TwitterClient} from "../TwitterClient";
import {DiscordMessageParser} from "../messageParsers/DiscordMessageParser";
import {PhraseAfterIdentifierMessageParser} from "../messageParsers/PhraseAfterIdentifierMessageParser";
import {DiscordMessageHandlerFactory} from "./DiscordMessageHandlerFactory";

export class TwitterBotMessageHandlerDispatcher {
    private readonly message: Message;
    private discordMessageParser: DiscordMessageParser;
    private twitterClient: TwitterClient;

    constructor(message, twitterClient: TwitterClient) {
        this.message = message;
        this.discordMessageParser = new PhraseAfterIdentifierMessageParser(this.message);
        this.twitterClient = twitterClient;
    }

    async dispatch() {
        if (this.messageContainsACommand()) {
            const discordMessageHandler = await new DiscordMessageHandlerFactory(
                this.message,
                this.twitterClient
            ).create();

            await discordMessageHandler.handle();
        }
    }

    private messageContainsACommand() {
        return this.getMatchingTwitterBotCommands().length === 1;
    }

    private getMatchingTwitterBotCommands() {
        return COMMANDS.filter(command => this.message.content.startsWith(command.command));
    }
}