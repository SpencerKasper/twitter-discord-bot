import {TweetReceivedHandler, TweetResponse} from "./TwitterClient";
import {MessageEmbed} from "discord.js";

export class DiscordTweetReceivedHandler implements TweetReceivedHandler {
    private discordChannelToMessage;

    constructor(discordChannelToMessage) {
        this.discordChannelToMessage = discordChannelToMessage;
    }

    handle(tweet: TweetResponse): void {
        console.log('Handling tweet...');
        try {
            const {text, author_id, id} = tweet.data;
            const twitterUsers = tweet.includes.users ? tweet.includes.users : [];
            const authorOfTweet = twitterUsers.filter(user => author_id === user.id)[0];

            const message = new MessageEmbed()
                .setTitle(`Tweet from ${authorOfTweet.username}`)
                .setDescription(text)
                .setColor('#1DA1F2')
                .setURL(`https://twitter.com/${authorOfTweet.username}/status/${id}`);

            this.discordChannelToMessage.send(message);
        } catch (error) {
            console.log(error);
        }
    }
}