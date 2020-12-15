import {auth} from "./auth";
import Discord, {Message} from 'discord.js';
import {TwitterBotMessageHandlerDispatcher} from "./discordMessageHandlers/TwitterBotMessageHandlerDispatcher";
import {TwitterClient} from "./TwitterClient";
import {DiscordTweetReceivedHandler} from "./DiscordTweetReceivedHandler";

const TWITTER_CHANNEL_ID = '785957073326178356';

const discordClient = new Discord.Client();
let discordChannelForTwitterBot;

let twitterClient: TwitterClient;

discordClient.on('ready', async () => {
    discordChannelForTwitterBot = discordClient.channels.cache
        .find(channel => channel.id === TWITTER_CHANNEL_ID);

    const discordTweetReceivedHandler = new DiscordTweetReceivedHandler(discordChannelForTwitterBot);
    twitterClient = new TwitterClient(discordTweetReceivedHandler);
    await twitterClient.initialize();
});

discordClient.on('message', async (message: Message) => {
    await new TwitterBotMessageHandlerDispatcher(message, twitterClient)
        .dispatch();
});

discordClient.login(auth.discord.token).then(r => {
    console.log(`Logged in as ${discordClient.user.tag}.`);
});