import {TweetReceivedHandler, TweetResponse} from "./TwitterClient";

export class DiscordTweetReceivedHandler implements TweetReceivedHandler {
    private discordChannelToMessage;

    constructor(discordChannelToMessage) {
        this.discordChannelToMessage = discordChannelToMessage;
    }

    handle(tweet: TweetResponse): void {
        console.log('Handling tweet...');
        const tweetText = tweet.data.text;

        this.discordChannelToMessage.send(tweetText);
    }
}