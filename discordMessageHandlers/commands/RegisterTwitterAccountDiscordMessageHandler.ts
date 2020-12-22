import {DiscordMessageHandler} from "../DiscordMessageHandler";
import {TwitterBotCommand} from "../../twitter-bot-commands";
import {Message} from "discord.js";
import {PhraseAfterIdentifierMessageParser} from "../../messageParsers/PhraseAfterIdentifierMessageParser";
import {DiscordUser} from "../../utils/DiscordUser";
import {TwitterClient} from "../../twitter/TwitterClient";

export class RegisterTwitterAccountDiscordMessageHandler implements DiscordMessageHandler {
    command: TwitterBotCommand;
    message: Message;
    private messageParser: PhraseAfterIdentifierMessageParser;
    private twitterClient: TwitterClient;

    constructor(message: Message, command: TwitterBotCommand, twitterClient: TwitterClient) {
        this.message = message;
        this.messageParser = new PhraseAfterIdentifierMessageParser(this.message);
        this.command = command;
        this.twitterClient = twitterClient;
    }

    async handle(): Promise<void> {
        console.log('Attempting to register twitter account...')
        const twitterUserName = this.messageParser.getArguments()[0];
        const discordUser = new DiscordUser(this.message);
        if (!discordUser.getTwitterUserNameOfMessageSender()) {
            const discordUserName = discordUser.getUserNameOfMessageSender();
            discordUser.updateUser(discordUserName, {twitterUserName});
            await this.twitterClient.addRules([{value: `from:${twitterUserName}`}]);
            await this.message.channel.send(`Successfully registered ${twitterUserName} to discord user ${discordUserName}`)
        } else {
            const message = `${discordUser.getUserNameOfMessageSender()} has already registered the twitter account, ${discordUser.getTwitterUserNameOfMessageSender()}`;
            await this.message.channel.send(message);
        }
    }

}