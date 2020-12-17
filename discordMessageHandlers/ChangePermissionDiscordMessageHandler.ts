import {DiscordMessageHandler} from "./DiscordMessageHandler";
import {Message} from "discord.js";
import {TwitterBotCommand} from "../static/twitter-bot-commands";
import {PhraseAfterIdentifierMessageParser} from "../messageParsers/PhraseAfterIdentifierMessageParser";
import {FileReaderAndWriter} from "../utils/FileReaderAndWriter";

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
        const user = parsedArguments[0];
        const privilegeLevel = parsedArguments[1];

        if (PRIVILEGE_LEVELS.filter(level => level === privilegeLevel.toLowerCase()).length !== 1) {
            await this.message.channel.send(`The privilege level received was not valid.  Acceptable values are "public" and "admin".`);
            return Promise.resolve();
        }

        const FILE_PATH = '/../user-permissions.json';
        const users = FileReaderAndWriter.readFile(FILE_PATH).users;
        const userToModify = users.find(item => item.userName === user.toLowerCase());

        if (userToModify) {
            const updatedUser = {
                ...userToModify,
                privilegeLevel
            };
            const indexOfUser = users.findIndex(item => item.userName === user.toLowerCase());
            users[indexOfUser] = updatedUser;
            FileReaderAndWriter.writeFile({users}, FILE_PATH);
            await this.message.channel.send(`User ${updatedUser.userName} privilege level set to ${updatedUser.privilegeLevel}`);
        } else {
            await this.message.channel.send(`User ${user} not found.`);
        }
    }
}