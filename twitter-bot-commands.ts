import {PrivilegeLevels} from "./utils/Privileges";

export interface TwitterBotCommand {
    commandName: string;
    command: string;
    privilegeLevel: PrivilegeLevels;
    sampleCall?: string;
    description?: string;
    references?: string[];
}

export const LIST_FILTERS_COMMAND: TwitterBotCommand = {
    commandName: 'List Filters',
    command: '!list-filters',
    privilegeLevel: 'public',
    sampleCall: '!list-filters'
};

export const LIST_USERS_COMMAND: TwitterBotCommand = {
    commandName: 'List Users',
    command: '!list-users',
    privilegeLevel: 'public',
    sampleCall: '!list-users'
};

export const ADD_TWITTER_FILTER_COMMAND: TwitterBotCommand = {
    commandName: 'Add Twitter Filter',
    command: '!add-filter',
    privilegeLevel: 'admin',
    sampleCall: '!add-filter from:7seven7seven777',
    description: 'The search term can be whatever you would type in a twitter search bar.  That means you could run the command "!add-filter ps5 release (walmart OR target OR gamestop)".',
    references: [
        'https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/integrate/build-a-rule'
    ]
}

export const DELETE_TWITTER_FILTER_COMMAND: TwitterBotCommand = {
    commandName: 'Delete Twitter Filter',
    command: '!delete-filter',
    privilegeLevel: 'admin',
    sampleCall: '!delete-filter 12345678910'
}

export const CHANGE_PERMISSIONS_COMMAND: TwitterBotCommand = {
    commandName: 'Change Permissions',
    command: '!chprm',
    privilegeLevel: 'admin',
    sampleCall: '!chprm poshprincess7 admin',
    description: 'Allows you to change the permissions for a user.  The first argument is the user and the second is the privilege level'
}

export const HELP_COMMAND: TwitterBotCommand = {
    commandName: 'Help',
    command: '!help',
    privilegeLevel: 'public'
}

export const COMMANDS: TwitterBotCommand[] = [
    LIST_FILTERS_COMMAND,
    LIST_USERS_COMMAND,
    ADD_TWITTER_FILTER_COMMAND,
    DELETE_TWITTER_FILTER_COMMAND,
    CHANGE_PERMISSIONS_COMMAND,
    HELP_COMMAND
];