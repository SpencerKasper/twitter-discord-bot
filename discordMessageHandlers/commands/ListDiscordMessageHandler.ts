import {DiscordMessageHandler} from "../DiscordMessageHandler";
import {Message} from "discord.js";
import {TwitterClient} from "../../TwitterClient";
import {TwitterBotCommand} from "../../static/twitter-bot-commands";

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
        if (currentRules) {
            const formattedRule = currentRules
                .map((rule) => ListDiscordMessageHandler.formatRule(rule))
                .join('\n');
            await this.message.channel.send(formattedRule);
        } else {
            await this.message.channel.send('There are currently no filter rules in effect.');
        }
    }

    private static formatRule(rule) {
        return `${rule.id} - ${rule.value}`;
    }
}