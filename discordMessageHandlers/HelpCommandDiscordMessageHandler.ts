import {DiscordMessageHandler} from "./DiscordMessageHandler";
import {Message} from "discord.js";
import {COMMANDS, TwitterBotCommand} from "../static/twitter-bot-commands";

export class HelpCommandDiscordMessageHandler implements DiscordMessageHandler {
    message: Message;
    command: TwitterBotCommand;

    constructor(message: Message, command: TwitterBotCommand) {
        this.message = message;
        this.command = command;
    }

    async handle(): Promise<void> {
        const helpMessage = HelpCommandDiscordMessageHandler.getHelpMessage();
        await this.message.channel.send(helpMessage);
    }

    private static getHelpMessage(): string {
        return COMMANDS.map(commandObj => {
            const {command, commandName, privilegeLevel, sampleCall, description, references} = commandObj;
            let helpMessage = `${commandName}\nIdentifier: ${command}\nRequired Privilege Level: ${privilegeLevel}`;

            if (sampleCall) {
                helpMessage = `${helpMessage}\nSample Call: ${sampleCall}`;
            }

            if (description) {
                helpMessage = `${helpMessage}\nDescription: ${description}`;
            }

            if (references) {
                helpMessage = `${helpMessage}\nSee here for more information:\n${references.join('\n')}`;
            }

            return helpMessage;
        }).join('\n\n');
    }
}