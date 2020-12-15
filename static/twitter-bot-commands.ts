import {PrivilegeLevels} from "../utils/Privileges";

export interface TwitterBotCommand {
    commandName: string;
    command: string;
    privilegeLevel: PrivilegeLevels;
    sampleCall?: string;
}

export const LIST_COMMAND: TwitterBotCommand = {
    commandName: 'List',
    command: '!list',
    privilegeLevel: 'public'
}

export const ADD_TWITTER_FILTER_COMMAND: TwitterBotCommand = {
    commandName: 'Add Twitter Filter',
    command: '!add-filter',
    privilegeLevel: 'admin',
    sampleCall: '!add-filter from:7seven7seven777'
}

export const COMMANDS: TwitterBotCommand[] = [
    LIST_COMMAND,
    ADD_TWITTER_FILTER_COMMAND
];