import {DiscordMessageHandler} from "./DiscordMessageHandler";
import {Message} from "discord.js";
import {TwitterClient} from "../TwitterClient";

export class AddTwitterFilterDiscordMessageHandler implements DiscordMessageHandler {
    private twitterClient: TwitterClient;
    message: Message;

    constructor(message: Message, twitterClient: TwitterClient) {
        this.message = message;
        this.twitterClient = twitterClient;
    }

    async handle(): Promise<void> {
        console.log('handling add twitter filter');
    }

}