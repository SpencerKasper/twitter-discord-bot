import {DiscordMessageHandler} from "./DiscordMessageHandler";
import {Message} from "discord.js";
import {TwitterClient} from "../TwitterClient";
import {TwitterBotCommand} from "../static/twitter-bot-commands";

export class ListDiscordMessageHandler implements DiscordMessageHandler {
    message: Message;
    command: TwitterBotCommand;
    private twitterClient: TwitterClient;

    constructor(message: Message, twitterClient: TwitterClient, command: TwitterBotCommand) {
        this.message = message;
        this.command = command;
        this.twitterClient = twitterClient;
    }

    async handle(): Promise<void> {
        const currentRules = await this.twitterClient
            .getCurrentRules();
        currentRules
            .map((rule) => this.sendFormattedRuleToChannel(rule))
    }

    private async sendFormattedRuleToChannel(rule) {
        const formattedRule = `${rule.id} - ${rule.value}`;
        await this.message.channel.send(formattedRule);
    }
}