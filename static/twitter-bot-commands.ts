import {PrivilegeLevels} from "../utils/Privileges";

export interface TwitterBotCommand {
    commandName: string;
    command: string;
    privilegeLevel: PrivilegeLevels;
    sampleCall?: string;
    description?: string;
    references?: string[];
}

export const LIST_COMMAND: TwitterBotCommand = {
    commandName: 'List',
    command: '!list',
    privilegeLevel: 'public'
}

export const ADD_TWITTER_FILTER_COMMAND: TwitterBotCommand = {
    commandName: 'Add Twitter Filter',
    command: '!add-filter',
    privilegeLevel: 'public',
    sampleCall: '!add-filter from:7seven7seven777',
    description: 'The search term can be whatever you would type in a twitter search bar.  That means you could run the command "!add-filter ps5 release (walmart OR target OR gamestop)".',
    references: [
        'https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/integrate/build-a-rule'
    ]
}

export const DELETE_TWITTER_FILTER_COMMAND: TwitterBotCommand = {
    commandName: 'Delete Twitter Filter',
    command: '!delete-filter',
    privilegeLevel: 'public',
    sampleCall: '!delete-filter 12345678910'
}

export const HELP_COMMAND: TwitterBotCommand = {
    commandName: 'Help',
    command: '!help',
    privilegeLevel: 'public'
}

export const COMMANDS: TwitterBotCommand[] = [
    LIST_COMMAND,
    ADD_TWITTER_FILTER_COMMAND,
    DELETE_TWITTER_FILTER_COMMAND,
    HELP_COMMAND
];