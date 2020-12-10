import {auth} from "./auth";
import needle from 'needle';

const TOKEN = auth.twitter.bearerToken;
const RULES_URL = 'https://api.twitter.com/2/tweets/search/stream/rules'
const STREAM_URL = 'https://api.twitter.com/2/tweets/search/stream';

const DEFAULT_RULES = [
    {'value': 'from:mcnuggetman711 is:retweet'},
    {'value': 'from:7seven7seven777 is:retweet'},
];

const HEADER = {
    "authorization": `Bearer ${TOKEN}`
};

const HEADERS_WITH_JSON = {
    ...HEADER,
    "content-type": "application/json"
};

export type TweetResponse = { data: { id: string; text: string; } };

export interface TweetReceivedHandler {
    handle(tweet: TweetResponse): void;
}

export class TwitterClient {
    private currentRules: string[];
    private filteredStream;
    private tweetReceivedHandler: TweetReceivedHandler;

    constructor(tweetReceivedHandler: TweetReceivedHandler) {
        this.tweetReceivedHandler = tweetReceivedHandler;
    }

    init = async () => {
        try {
            let timeout = 0;
            this.filteredStream = this.initializeStream();
            this.filteredStream.on('timeout', () => {
                console.warn('A connection error occurred. Reconnecting…');
                setTimeout(() => {
                    timeout++;
                    this.initializeStream();
                }, 2 ** timeout);
                this.initializeStream();
            })
            await this.addRules();
        } catch (e) {
            console.error(e);
            process.exit(-1);
        }
    }

    initializeStream = () => {
        console.log('Connecting stream...')
        const options = {
            timeout: 20000
        }

        const stream = needle.get(STREAM_URL, {
            headers: HEADER
        }, options);

        stream.on('data', data => {
            try {
                const tweet: TweetResponse = JSON.parse(data);
                this.tweetReceivedHandler.handle(tweet);

            } catch (e) {
            }
        }).on('error', error => {
            if (error.code === 'ETIMEDOUT') {
                stream.emit('timeout');
            }
        });
        console.log('Successfully created a stream.')
        return stream;
    };

    addRules = async (rules = DEFAULT_RULES) => {
        const data = {
            "add": rules
        }
        console.log('Adding rules...')
        const response = await needle('post', RULES_URL, data, {
            headers: HEADERS_WITH_JSON
        });

        if (response.statusCode !== 201) {
            throw new Error(response.body);
        }

        return (response.body);
    };

    getAllRules = async () => {
        const response = await needle('get', RULES_URL, {
            headers: HEADER
        })

        if (response.statusCode !== 200) {
            throw new Error(response.body);
        }

        return (response.body);
    };

    deleteAllRules = async rules => {
        if (!Array.isArray(rules.data)) {
            return null;
        }

        const ids = rules.data.map(rule => rule.id);

        const data = {
            "delete": {
                "ids": ids
            }
        }

        const response = await needle('post', RULES_URL, data, {
            headers: HEADERS_WITH_JSON
        })

        if (response.statusCode !== 200) {
            throw new Error(response.body);
        }

        return (response.body);
    };
}