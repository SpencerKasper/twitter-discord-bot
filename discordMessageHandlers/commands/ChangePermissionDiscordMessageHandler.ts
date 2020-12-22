import {DiscordMessageHandler} from "../DiscordMessageHandler";
import {Message} from "discord.js";
import {TwitterBotCommand} from "../../twitter-bot-commands";
import {PhraseAfterIdentifierMessageParser} from "../../messageParsers/PhraseAfterIdentifierMessageParser";
import {FileReaderAndWriter} from "../../utils/FileReaderAndWriter";
import {DiscordUser} from "../../utils/DiscordUser";

const PRIVILEGE_LEVELS = [
    'public',
    'admin'
];

export class ChangePermissionsDiscordMessageHandler implements DiscordMessageHandler {
    command: TwitterBotCommand;
    message: Message;
    private messageParser: PhraseAfterIdentifierMessageParser;

    constructor(message: Message, command: TwitterBotCommand) {
        this.command = command;
        this.message = message;
        this.messageParser = new PhraseAfterIdentifierMessageParser(message);
    }

    async handle(): Promise<void> {
        const parsedArguments = this.messageParser.getArguments();
        const userName = parsedArguments[0];
        const privilegeLevel = parsedArguments[1];

        if (PRIVILEGE_LEVELS.filter(level => level === privilegeLevel.toLowerCase()).length !== 1) {
            await this.message.channel.send(`The privilege level received was not valid.  Acceptable values are "public" and "admin".`);
            return Promise.resolve();
        }

        const updatedUser = await new DiscordUser(this.message).updateUser(userName, {privilegeLevel});
        if (updatedUser) {
            await this.message.channel.send(`User ${updatedUser.userName} privilege level set to ${updatedUser.privilegeLevel}`);
        } else {
            await this.message.channel.send(`User ${userName} not found.`);
        }

    }
}