import {DiscordMessageParser} from "./DiscordMessageParser";
import {Message} from "discord.js";

export class PhraseAfterIdentifierMessageParser implements DiscordMessageParser {
    message: Message;
    private readonly command: string;

    constructor(message: Message) {
        this.message = message;
        this.command = this.message.content.split(' ')[0];
    }

    parse = (): string => {
        const allOfTheWordsWithIdentifierFirst: string[] = this.message.content.split(' ');
        allOfTheWordsWithIdentifierFirst.shift();
        return allOfTheWordsWithIdentifierFirst.join(' ');
    }

    getCommand = (): string => {
        return this.command;
    }
}