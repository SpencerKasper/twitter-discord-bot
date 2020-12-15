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
        const currentRules = await this.twitterClient
            .getCurrentRules();
        currentRules
            .map((rule, index) => this.sendFormattedRuleToChannel(rule))
    }

    private async sendFormattedRuleToChannel(rule) {
        const formattedRule = `${rule.id} - ${rule.value}`;
        await this.message.channel.send(formattedRule);
    }
}