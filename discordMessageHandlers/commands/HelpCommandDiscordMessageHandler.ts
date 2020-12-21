import {DiscordMessageHandler} from "../DiscordMessageHandler";
import {Message, MessageEmbed} from "discord.js";
import {COMMANDS, TwitterBotCommand} from "../../static/twitter-bot-commands";

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

    private static getHelpMessage(): MessageEmbed {
        const message = new MessageEmbed()
            .setTitle('Commands List')
            .setDescription('Some commands require different privilege levels.  Admins can escalate privilege levels for users.')
            .setColor('#1DA1F2');
        COMMANDS.forEach(commandObj => {
            const {command, commandName, privilegeLevel, sampleCall, description, references} = commandObj;
            let helpMessage = `Identifier: ${command}\nRequired Privilege Level: ${privilegeLevel}`;
            if (sampleCall) {
                helpMessage = `${helpMessage}\nSample Call: ${sampleCall}`;
            }
            if (description) {
                helpMessage = `${helpMessage}\nDescription: ${description}`;
            }
            if (references) {
                helpMessage = `${helpMessage}\nSee here for more information:\n${references.join('\n')}`;
            }
            message.addField(commandName, helpMessage);
        });

        return message;
    }
}