import {auth} from "./auth";
import {ErrorLogger} from "./utils/ErrorLogger";
import Discord from 'discord.js';
import {SpotifyBotMessageHandlerDispatcher} from "./SpotifyBotMessageHandlerDispatcher";

const client = new Discord.Client();

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

});

client.on('message', async message => {
    try {
        new SpotifyBotMessageHandlerDispatcher(message).dispatch();
    } catch (error) {
        ErrorLogger.log(error);
    }
});

client.login(auth.discordToken).then(r => {
    console.log("Logged in");
});