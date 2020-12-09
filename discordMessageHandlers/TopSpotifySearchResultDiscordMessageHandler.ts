import {Message} from "discord.js";
import {DiscordMessageHandler} from "./DiscordMessageHandler";
import {DiscordMessageParser} from "../messageParsers/DiscordMessageParser";
import {PhraseAfterIdentifierMessageParser} from "../messageParsers/PhraseAfterIdentifierMessageParser";
import {SearchResultsSpotifyDataSource, SpotifySearchType} from "../data/SearchResultsSpotifyDataSource";
import {SPOTIFY_SEARCH_TYPE_ARTIST, SPOTIFY_SEARCH_TYPE_TYPE_TRACK} from "../static/SpotifySearchConstants";

export class TopSpotifySearchResultDiscordMessageHandler implements DiscordMessageHandler {
    message: Message;
    messageParser: DiscordMessageParser;
    private searchType: SpotifySearchType;

    constructor(
        message: Message
    ) {
        this.message = message;
        this.messageParser = new PhraseAfterIdentifierMessageParser(message);
        this.searchType = message.content.startsWith('!song-search') ?
            SPOTIFY_SEARCH_TYPE_TYPE_TRACK :
            SPOTIFY_SEARCH_TYPE_ARTIST;
    }

    handle: VoidFunction = async () => {
        const {messageParser, message, searchType} = this;
        const query = messageParser
            .parse();

        const spotifyUrl = await new SearchResultsSpotifyDataSource()
            .getTopResult({query, type: searchType});

        await message.channel
            .send(spotifyUrl);
    };

}