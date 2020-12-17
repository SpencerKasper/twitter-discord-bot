import {Message} from "discord.js";
import {TwitterClient} from "../TwitterClient";
import {PhraseAfterIdentifierMessageParser} from "../messageParsers/PhraseAfterIdentifierMessageParser";
import {DiscordMessageHandler} from "./DiscordMessageHandler";
import {
    ADD_TWITTER_FILTER_COMMAND,
    CHANGE_PERMISSIONS_COMMAND,
    DELETE_TWITTER_FILTER_COMMAND,
    HELP_COMMAND,
    LIST_FILTERS_COMMAND,
    LIST_USERS_COMMAND
} from "../static/twitter-bot-commands";
import {ListDiscordMessageHandler} from "./ListDiscordMessageHandler";
import {AddTwitterFilterDiscordMessageHandler} from "./AddTwitterFilterDiscordMessageHandler";
import {DeleteTwitterFilterDiscordMessageHandler} from "./DeleteTwitterFilterDiscordMessageHandler";
import {HelpCommandDiscordMessageHandler} from "./HelpCommandDiscordMessageHandler";
import {ChangePermissionsDiscordMessageHandler} from "./ChangePermissionDiscordMessageHandler";
import {ListUsersDiscordMessageHandler} from "./ListUsersDiscordMessageHandler";

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
            case(LIST_FILTERS_COMMAND.command):
                return new ListDiscordMessageHandler(this.message, this.twitterClient, LIST_FILTERS_COMMAND);
            case(ADD_TWITTER_FILTER_COMMAND.command):
                return new AddTwitterFilterDiscordMessageHandler(this.message, this.twitterClient, ADD_TWITTER_FILTER_COMMAND);
            case(DELETE_TWITTER_FILTER_COMMAND.command):
                return new DeleteTwitterFilterDiscordMessageHandler(this.message, this.twitterClient, DELETE_TWITTER_FILTER_COMMAND);
            case(CHANGE_PERMISSIONS_COMMAND.command):
                return new ChangePermissionsDiscordMessageHandler(this.message, CHANGE_PERMISSIONS_COMMAND);
            case(HELP_COMMAND.command):
                return new HelpCommandDiscordMessageHandler(this.message, HELP_COMMAND);
            case(LIST_USERS_COMMAND.command):
                return new ListUsersDiscordMessageHandler(this.message, LIST_USERS_COMMAND);
        }
    }
}