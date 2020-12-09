type SpotifyBotCommand = {
    commandName: string;
    command: string;
    sampleCall?: string;
    commandType: string;
}

const songSearchCommand = {
    commandName: 'Song Search',
    command: '!song-search',
    sampleCall: '!song-search Dang!',
    commandType: 'search'
};

const artistSearchCommand = {
    commandName: 'Artist Search',
    command: '!artist-search',
    sampleCall: '!artist-search Mac Miller',
    commandType: 'search'
};

export const COMMANDS: SpotifyBotCommand[] = [
    songSearchCommand,
    artistSearchCommand
];