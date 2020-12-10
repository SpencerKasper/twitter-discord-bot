type TwitterBotCommand = {
    commandName: string;
    command: string;
    sampleCall?: string;
    commandType: string;
}

const LIST: TwitterBotCommand = {
    commandName: 'List',
    command: '!list',
    commandType: 'list'
}

export const COMMANDS: TwitterBotCommand[] = [
    LIST
];