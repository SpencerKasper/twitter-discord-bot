import {TweetReceivedHandler, TweetResponse} from "./TwitterClient";

export class DiscordTweetReceivedHandler implements TweetReceivedHandler {
    private discordChannelToMessage;

    constructor(discordChannelToMessage) {
        this.discordChannelToMessage = discordChannelToMessage;
    }

    handle(tweet: TweetResponse): void {
        console.log('Handling tweet...');
        try {
            const {author_id, id} = tweet.data;
            const twitterUsers = tweet.includes.users ? tweet.includes.users : [];
            const authorOfTweet = twitterUsers.filter(user => author_id === user.id)[0];
            this.discordChannelToMessage.send(`https://twitter.com/${authorOfTweet.username}/status/${id}`);
        } catch (error) {
            console.log(error);
        }
    }
}