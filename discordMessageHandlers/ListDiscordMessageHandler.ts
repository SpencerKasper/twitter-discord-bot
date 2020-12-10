import {DiscordMessageHandler} from "./DiscordMessageHandler";
import {Message} from "discord.js";
import {TwitterClient} from "../TwitterClient";

export class ListDiscordMessageHandler implements DiscordMessageHandler {
    message: Message;
    private twitterClient: TwitterClient;

    constructor(message: Message, twitterClient: TwitterClient) {
        this.message = message;
        this.twitterClient = twitterClient;
    }

    async handle(): Promise<void> {
        this.twitterClient
            .getCurrentRules()
            .map((rule, index) => this.sendFormattedRuleToChannel(rule, index))
    }

    private async sendFormattedRuleToChannel(rule, index) {
        const formattedRule = `Rule ${index + 1} of 25: ${rule.value}`;
        await this.message.channel.send(formattedRule);
    }
}