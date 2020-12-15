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
        const formattedRule = currentRules
            .map((rule) => ListDiscordMessageHandler.formatRule(rule))
            .join('\n');
        await this.message.channel.send(formattedRule);
    }

    private static formatRule(rule) {
        return `${rule.id} - ${rule.value}`;
    }
}