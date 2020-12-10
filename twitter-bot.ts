import {auth} from "./auth";
import Discord, {Channel} from 'discord.js';
import {TwitterBotMessageHandlerDispatcher} from "./discordMessageHandlers/TwitterBotMessageHandlerDispatcher";
import needle from 'needle';

const TWITTER_CHANNEL_ID = '785957073326178356';
const discordClient = new Discord.Client();
let twitterChannel;

discordClient.on('ready', async () => {
    console.log(`Logged in as ${discordClient.user.tag}!`);
    twitterChannel = discordClient.channels.cache.find(channel => channel.id === TWITTER_CHANNEL_ID)
    twitterChannel.send('Twitter bot is online.')
});

// discordClient.on('message', async message => {
//     try {
//         await new TwitterBotMessageHandlerDispatcher(message).dispatch();
//     } catch (error) {
//     }
// });

discordClient.login(auth.discord.token).then(r => {
    console.log("Logged in");
});

const TOKEN = auth.twitter.bearerToken;

const RULES_URL = 'https://api.twitter.com/2/tweets/search/stream/rules'
const STREAM_URL = 'https://api.twitter.com/2/tweets/search/stream';

const rules = [
    { 'value': 'from:mcnuggetman711 is:retweet' },
    { 'value': 'from:7seven7seven777 is:retweet' },
];

const getAllRules = async () => {
    const response = await needle('get', RULES_URL, { headers: {
            "authorization": `Bearer ${TOKEN}`
        }})

    if (response.statusCode !== 200) {
        throw new Error(response.body);
    }

    return (response.body);
};

const deleteAllRules = async rules => {

    if (!Array.isArray(rules.data)) {
        return null;
    }

    const ids = rules.data.map(rule => rule.id);

    const data = {
        "delete": {
            "ids": ids
        }
    }

    const response = await needle('post', RULES_URL, data, {headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${TOKEN}`
        }})

    if (response.statusCode !== 200) {
        throw new Error(response.body);
    }

    return (response.body);
};

const setRules = async () => {
    const data = {
        "add": rules
    }

    const response = await needle('post', RULES_URL, data, {headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${TOKEN}`
        }})

    if (response.statusCode !== 201) {
        throw new Error(response.body);
    }

    return (response.body);
};

function streamConnect() {
    console.log('Connecting stream...')
    const options = {
        timeout: 20000
    }

    const stream = needle.get(STREAM_URL, {
        headers: {
            Authorization: `Bearer ${TOKEN}`
        }
    }, options);

    stream.on('data', data => {
        try {
            console.log(data);
            const tweet: {data: {id: string; text: string;}} = JSON.parse(data);
            twitterChannel.send(tweet.data.text);

        } catch (e) {
        }
    }).on('error', error => {
        if (error.code === 'ETIMEDOUT') {
            stream.emit('timeout');
        }
    });
    console.log('Successfully created a stream.')
    return stream;
}


(async () => {
    let currentRules;

    try {
        // Gets the complete list of rules currently applied to the stream
        currentRules = await getAllRules();

        // Delete all rules. Comment the line below if you want to keep your existing rules.
        await deleteAllRules(currentRules);

        // Add rules to the stream. Comment the line below if you don't want to add new rules.
        await setRules();

    } catch (e) {
        console.error(e);
        process.exit(-1);
    }

    // Listen to the stream.
    // This reconnection logic will attempt to reconnect when a disconnection is detected.
    // To avoid rate limites, this logic implements exponential backoff, so the wait time
    // will increase if the discordClient cannot reconnect to the stream.

    const filteredStream = streamConnect()
    let timeout = 0;
    filteredStream.on('timeout', () => {
        // Reconnect on error
        console.warn('A connection error occurred. Reconnecting…');
        setTimeout(() => {
            timeout++;
            streamConnect();
        }, 2 ** timeout);
        streamConnect();
    })

})();