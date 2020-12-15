import {DiscordMessageHandler} from "./DiscordMessageHandler";
import {Message} from "discord.js";
import {TwitterClient} from "../TwitterClient";
import {PhraseAfterIdentifierMessageParser} from "../messageParsers/PhraseAfterIdentifierMessageParser";

export class AddTwitterFilterDiscordMessageHandler implements DiscordMessageHandler {
    private twitterClient: TwitterClient;
    message: Message;
    private discordMessageParser: PhraseAfterIdentifierMessageParser;

    constructor(message: Message, twitterClient: TwitterClient) {
        this.message = message;
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
        currentRules
            .map((rule) => this.sendFormattedRuleToChannel(rule))
    }

    private async sendFormattedRuleToChannel(rule) {
        const formattedRule = `${rule.id} - ${rule.value}`;
        await this.message.channel.send(formattedRule);
    }

}