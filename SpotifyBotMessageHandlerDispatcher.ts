import {TopSpotifySearchResultDiscordMessageHandler} from "./discordMessageHandlers/TopSpotifySearchResultDiscordMessageHandler";
import {Message} from "discord.js";
import {COMMANDS} from "./static/SpotifyBotCommands";

export class SpotifyBotMessageHandlerDispatcher {
    private readonly message: Message;

    constructor(message) {
        this.message = message;
    }

    async dispatch() {
        if (this.messageContainsACommand()) {
            new TopSpotifySearchResultDiscordMessageHandler(
                this.message
            ).handle();
        }
    }

    private messageContainsACommand() {
        return this.getMatchingSpotifyBotCommands().length === 1;
    }

    private getMatchingSpotifyBotCommands() {
        return COMMANDS.filter(command => this.message.content.startsWith(command.command));
    }
}