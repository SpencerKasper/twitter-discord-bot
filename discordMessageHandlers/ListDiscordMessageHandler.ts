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
        this.twitterClient.getCurrentRules().map(async (rule, index) => {
            await this.message.channel.send(`Rule ${index + 1}/25: ${rule.value}`);
        })
    }
}