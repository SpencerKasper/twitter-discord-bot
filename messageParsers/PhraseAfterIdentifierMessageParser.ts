import {DiscordMessageParser} from "./DiscordMessageParser";
import {Message} from "discord.js";

export class PhraseAfterIdentifierMessageParser implements DiscordMessageParser {
    message: Message;

    constructor(message: Message) {
        this.message = message;
    }

    parse = (): string => {
        const allOfTheWordsWithIdentifierFirst: string[] = this.message.content.split(' ');
        allOfTheWordsWithIdentifierFirst.shift();
        return allOfTheWordsWithIdentifierFirst.join(' ');
    }
}