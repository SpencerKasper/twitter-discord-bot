import {Message} from "discord.js";
import {TwitterClient} from "../TwitterClient";
import {PhraseAfterIdentifierMessageParser} from "../messageParsers/PhraseAfterIdentifierMessageParser";
import {DiscordMessageHandler} from "./DiscordMessageHandler";
import {ADD_TWITTER_FILTER_COMMAND, LIST_COMMAND} from "../static/twitter-bot-commands";
import {ListDiscordMessageHandler} from "./ListDiscordMessageHandler";
import {AddTwitterFilterDiscordMessageHandler} from "./AddTwitterFilterDiscordMessageHandler";

export class DiscordMessageHandlerFactory {
    private readonly message: Message;
    private readonly twitterClient: TwitterClient;
    private discordMessageParser: PhraseAfterIdentifierMessageParser;

    constructor(message: Message, twitterClient: TwitterClient) {
        this.message = message;
        this.twitterClient = twitterClient;
        this.discordMessageParser = new PhraseAfterIdentifierMessageParser(this.message);
    }

    create(): DiscordMessageHandler {
        switch (this.discordMessageParser.getCommand()) {
            case(LIST_COMMAND.command):
                return new ListDiscordMessageHandler(this.message, this.twitterClient);
            case(ADD_TWITTER_FILTER_COMMAND.command):
                return new AddTwitterFilterDiscordMessageHandler(this.message, this.twitterClient);
        }
    }
}