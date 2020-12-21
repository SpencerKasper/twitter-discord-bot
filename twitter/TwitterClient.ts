import {auth} from "../auth";
import needle from 'needle';

const TOKEN = auth.twitter.bearerToken;
const RULES_URL = 'https://api.twitter.com/2/tweets/search/stream/rules'
const STREAM_URL = 'https://api.twitter.com/2/tweets/search/stream';

const HEADER = {
    "authorization": `Bearer ${TOKEN}`
};

const HEADERS_WITH_JSON = {
    ...HEADER,
    "content-type": "application/json"
};

type MatchingTwitterRule = { id: number, tag: string | null };
type TwitterUser = { id: string; name: string; username: string; };
type TweetEntities = { urls?: string[]; mentions?: string[]; annotations: string[]; };
export type TweetResponse = {
    data: {
        author_id?: string;
        id: string;
        text: string;
    },
    entities?: TweetEntities,
    includes?: {
        users: TwitterUser[]
    },
    matching_rules?: MatchingTwitterRule[]
};

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
        } catch (e) {
            console.error(e);
        }
    }

    public addRules = async (rules: TwitterFilterRule[]) => {
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

        const queryParams = `expansions=author_id&tweet.fields=entities`;
        const fullUrl = `${STREAM_URL}?${queryParams}`;
        const stream = await needle.get(fullUrl, {
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

    public deleteRulesById = async ruleIds => {
        const data = {
            delete: {
                ids: ruleIds
            }
        }

        const response = await needle('post', RULES_URL, data, {
            headers: HEADERS_WITH_JSON
        })

        this.optionallyThrowErrors(response);

        return (response.body.meta.summary);
    };

    private deleteAllRules = async () => {
        const existingRules = await this.getCurrentRules();

        if (existingRules && existingRules.length > 0) {
            const ids = existingRules.map(rule => rule.id);
            await this.deleteRulesById(ids);
        }
    }
}