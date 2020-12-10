import {auth} from "./auth";
import Discord, {Channel} from 'discord.js';
import {TwitterBotMessageHandlerDispatcher} from "./discordMessageHandlers/TwitterBotMessageHandlerDispatcher";
import needle from 'needle';
import {TwitterClient} from "./TwitterClient";
import {DiscordTweetReceivedHandler} from "./DiscordTweetReceivedHandler";

const TWITTER_CHANNEL_ID = '785957073326178356';

const discordClient = new Discord.Client();
let discordChannelForTwitterBot;

let twitterClient;

discordClient.on('ready', async () => {
    discordChannelForTwitterBot = discordClient.channels.cache
        .find(channel => channel.id === TWITTER_CHANNEL_ID);
    discordChannelForTwitterBot.send('Twitter bot is online.');

    const discordTweetReceivedHandler = new DiscordTweetReceivedHandler(discordChannelForTwitterBot);
    twitterClient = new TwitterClient(discordTweetReceivedHandler);
    await twitterClient.init();
});

discordClient.login(auth.discord.token).then(r => {
    console.log(`Logged in as ${discordClient.user.tag}.`);
});