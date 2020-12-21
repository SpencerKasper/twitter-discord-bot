import {DiscordMessageHandler} from "../DiscordMessageHandler";
import {Message} from "discord.js";
import {TwitterClient} from "../../twitter/TwitterClient";
import {PhraseAfterIdentifierMessageParser} from "../../messageParsers/PhraseAfterIdentifierMessageParser";
import {TwitterBotCommand} from "../../twitter-bot-commands";

export class AddTwitterFilterDiscordMessageHandler implements DiscordMessageHandler {
    message: Message;
    command: TwitterBotCommand;
    private twitterClient: TwitterClient;
    private discordMessageParser: PhraseAfterIdentifierMessageParser;

    constructor(message: Message, twitterClient: TwitterClient, twitterBotCommand: TwitterBotCommand) {
        this.message = message;
        this.command = twitterBotCommand;
        this.twitterClient = twitterClient;
        this.discordMessageParser = new PhraseAfterIdentifierMessageParser(this.message);
    }

    async handle(): Promise<void> {
        const potentialTwitterFilterToAdd = this.discordMessageParser
            .getArguments()
            .join(' ');

        await this.twitterClient
            .addRules([
                {value: potentialTwitterFilterToAdd}
            ]);

        const currentRules = await this.twitterClient.getCurrentRules();
        await this.message.channel.send('Successfully added rule. Here is a list of the current rules in effect:')
        const formattedRules = currentRules
            .map((rule) => this.formatRule(rule))
            .join('\n');
        await this.message.channel.send(formattedRules);
    }

    private formatRule(rule) {
        return `${rule.id} - ${rule.value}`;
    }

}