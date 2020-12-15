import {Message} from "discord.js";
import {COMMANDS} from "../static/twitter-bot-commands";
import {ListDiscordMessageHandler} from "./ListDiscordMessageHandler";
import {TwitterClient} from "../TwitterClient";
import {DiscordMessageParser} from "../messageParsers/DiscordMessageParser";
import {PhraseAfterIdentifierMessageParser} from "../messageParsers/PhraseAfterIdentifierMessageParser";
import {DiscordMessageHandlerFactory} from "./DiscordMessageHandlerFactory";
import {DiscordUser} from "../utils/DiscordUser";
import {Privileges} from "../utils/Privileges";

export class TwitterBotMessageHandlerDispatcher {
    private readonly message: Message;
    private discordMessageParser: DiscordMessageParser;
    private twitterClient: TwitterClient;
    private readonly discordUser: DiscordUser;

    constructor(message, twitterClient: TwitterClient) {
        this.message = message;
        this.discordUser = new DiscordUser(this.message);
        this.discordMessageParser = new PhraseAfterIdentifierMessageParser(this.message);
        this.twitterClient = twitterClient;
    }

    async dispatch() {
        if (this.messageContainsACommand()) {
            const discordMessageHandler = await new DiscordMessageHandlerFactory(
                this.message,
                this.twitterClient
            ).create();

            if (Privileges.userIsPermissionedForCommand(discordMessageHandler.command, this.discordUser)) {
                await discordMessageHandler.handle();
            } else {
                await this.message.channel.send('You do not have permission to run this command.');
            }
        }
    }

    private messageContainsACommand() {
        return this.getMatchingTwitterBotCommands().length === 1;
    }

    private getMatchingTwitterBotCommands() {
        return COMMANDS.filter(command => this.message.content.startsWith(command.command));
    }
}