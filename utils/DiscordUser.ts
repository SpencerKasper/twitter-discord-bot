import {Client, Message} from "discord.js";
import {FileReaderAndWriter} from "./FileReaderAndWriter";

export class DiscordUser {
    private message: Message;
    private discordClient: Client;
    private readonly userName: string;

    constructor(message: Message) {
        this.message = message;
        this.discordClient = message.client;
        this.userName = message.member.user.username;
    }

    public getUserName() {
        return this.userName.toLowerCase();
    }
}