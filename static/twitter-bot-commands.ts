interface TwitterBotCommand {
    commandName: string;
    command: string;
    sampleCall?: string;
    commandType: string;
}

export const LIST_COMMAND: TwitterBotCommand = {
    commandName: 'List',
    command: '!list',
    commandType: 'list'
}

export const ADD_TWITTER_FILTER_COMMAND: TwitterBotCommand = {
    commandName: 'Add Twitter Filter',
    command: '!add-filter',
    commandType: 'add',
    sampleCall: '!add-filter from:7seven7seven777'
}

export const COMMANDS: TwitterBotCommand[] = [
    LIST_COMMAND,
    ADD_TWITTER_FILTER_COMMAND
];