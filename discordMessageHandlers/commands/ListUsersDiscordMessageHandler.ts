import {DiscordMessageHandler} from "../DiscordMessageHandler";
import {Message} from "discord.js";
import {TwitterBotCommand} from "../../static/twitter-bot-commands";
import {PhraseAfterIdentifierMessageParser} from "../../messageParsers/PhraseAfterIdentifierMessageParser";
import {FileReaderAndWriter} from "../../utils/FileReaderAndWriter";

export class ListUsersDiscordMessageHandler implements DiscordMessageHandler {
    command: TwitterBotCommand;
    message: Message;
    private messageParser: PhraseAfterIdentifierMessageParser;

    constructor(message: Message, command: TwitterBotCommand) {
        this.message = message;
        this.command = command;
        this.messageParser = new PhraseAfterIdentifierMessageParser(this.message);
    }

    async handle(): Promise<void> {
        const users = FileReaderAndWriter.readFile('/../user-permissions.json').users;
        const userMessage = users.map(user => `Discord Username: ${user.userName}\nPrivilege Level: ${user.privilegeLevel}`)
            .join('\n\n');
        await this.message.channel.send(userMessage);
    }

}