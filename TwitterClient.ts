import {auth} from "./auth";
import needle from 'needle';

const TOKEN = auth.twitter.bearerToken;
const RULES_URL = 'https://api.twitter.com/2/tweets/search/stream/rules'
const STREAM_URL = 'https://api.twitter.com/2/tweets/search/stream';

const DEFAULT_RULES: TwitterFilterRule[] = [
    {'value': 'from:mcnuggetman711'},
    {'value': 'from:thecupkatie'},
    {'value': 'from:amazinganthony7'},
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

type TwitterFilterRule = {
    value: string
};

export class TwitterClient {
    private filteredStream;
    private tweetReceivedHandler: TweetReceivedHandler;

    constructor(tweetReceivedHandler: TweetReceivedHandler) {
        this.tweetReceivedHandler = tweetReceivedHandler;
    }

    public initialize = async () => {
        try {
            let timeout = 0;
            this.filteredStream = await this.startStream();
            this.filteredStream.on('timeout', async () => {
                console.warn('A connection error occurred. Reconnecting…');
                setTimeout(async () => {
                    timeout++;
                    await this.startStream();
                }, 2 ** timeout);
                await this.startStream();
            })
            const existingRules = await this.getCurrentRules();
            if (existingRules.length > 0) {
                await this.deleteAllRules(existingRules);
            }
            await this.addRules();
        } catch (e) {
            console.error(e);
            process.exit(-1);
        }
    }

    public addRules = async (rules = DEFAULT_RULES) => {
        const data = {
            "add": rules
        }
        console.log('Adding rules...')
        const response = await needle('post', RULES_URL, data, {
            headers: HEADERS_WITH_JSON
        });

        this.optionallyThrowErrors(response);
        return (response.body);
    };

    private startStream = async () => {
        console.log('Connecting stream...')
        const options = {
            timeout: 20000
        }

        const stream = await needle.get(STREAM_URL, {
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

    private optionallyThrowErrors = (response) => {
        if (this.responseIsNotAcceptable(response)) {
            console.log(`ERROR: ${response.statusCode}\n${response.message}`)
            throw new Error(response.body);
        }
    }

    private responseIsNotAcceptable(response) {
        const ACCEPTABLE_STATUS_CODES = [200, 201];
        return ACCEPTABLE_STATUS_CODES.filter(code => code === Number(response.statusCode)).length !== 1;
    }

    public getCurrentRules = async () => {
        const response = await needle('get', RULES_URL, {
            headers: HEADER
        })

        this.optionallyThrowErrors(response);

        return (response.body.data);
    };

    private deleteAllRules = async rules => {
        const ids = rules.map(rule => rule.id);

        const data = {
            "delete": {
                "ids": ids
            }
        }

        const response = await needle('post', RULES_URL, data, {
            headers: HEADERS_WITH_JSON
        })

        this.optionallyThrowErrors(response);
        console.log(response.body);
        return (response.body);
    };
}