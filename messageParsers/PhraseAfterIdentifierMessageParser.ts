import {DiscordMessageParser} from "./DiscordMessageParser";
import {Message} from "discord.js";

export class PhraseAfterIdentifierMessageParser implements DiscordMessageParser {
    message: Message;
    private readonly command: string;
    private readonly arguments: string[];

    constructor(message: Message) {
        this.message = message;
        const allOfTheWordsWithIdentifierFirst: string[] = this.message.content.split(' ');
        this.command = allOfTheWordsWithIdentifierFirst[0];
        allOfTheWordsWithIdentifierFirst.shift();
        this.arguments = allOfTheWordsWithIdentifierFirst;
    }

    getCommand = (): string => {
        return this.command;
    }

    getArguments = (): string[] => {
        return this.arguments;
    }
}