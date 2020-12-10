import {auth} from "./auth";
import Discord from 'discord.js';
import {TwitterBotMessageHandlerDispatcher} from "./discordMessageHandlers/TwitterBotMessageHandlerDispatcher";

const client = new Discord.Client();

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

});

client.on('message', async message => {
    try {
        await new TwitterBotMessageHandlerDispatcher(message).dispatch();
    } catch (error) {
    }
});

client.login(auth.discord.token).then(r => {
    console.log("Logged in");
});