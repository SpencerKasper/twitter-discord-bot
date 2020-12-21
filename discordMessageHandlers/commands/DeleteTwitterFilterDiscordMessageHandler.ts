import {DiscordMessageHandler} from "../DiscordMessageHandler";
import {Message} from "discord.js";
import {TwitterClient} from "../../twitter/TwitterClient";
import {TwitterBotCommand} from "../../static/twitter-bot-commands";
import {PhraseAfterIdentifierMessageParser} from "../../messageParsers/PhraseAfterIdentifierMessageParser";

export class DeleteTwitterFilterDiscordMessageHandler implements DiscordMessageHandler {
    message: Message;
    command: TwitterBotCommand;
    private twitterClient: TwitterClient;
    private discordMessageParser: PhraseAfterIdentifierMessageParser;

    constructor(message: Message, twitterClient: TwitterClient, command: TwitterBotCommand) {
        this.message = message;
        this.command = command;
        this.twitterClient = twitterClient;
        this.discordMessageParser = new PhraseAfterIdentifierMessageParser(this.message);
    }

    async handle(): Promise<void> {
        const ruleIds = this.discordMessageParser.getArguments();
        const deleteSummary = await this.twitterClient.deleteRulesById(ruleIds);
        await this.message.channel.send(`Successfully deleted ${deleteSummary.deleted} rules.  ${deleteSummary.not_deleted} rules failed to delete.`);
    }

}