import {Client, Message} from "discord.js";
import {FileReaderAndWriter} from "./FileReaderAndWriter";

const FILE_PATH = '/../user-permissions.json';

export class DiscordUser {
    private readonly userName: string;
    private readonly twitterUserName: string;

    constructor(message: Message) {
        this.userName = message.member.user.username;
        const users = FileReaderAndWriter.readFile(FILE_PATH).users;
        const user = users.find(item => item.userName === this.userName.toLowerCase());
        this.twitterUserName = user ? user.twitterUserName : undefined;
    }

    public getUserNameOfMessageSender() {
        return this.userName.toLowerCase();
    }

    public getTwitterUserNameOfMessageSender() {
        return this.twitterUserName;
    }

    public updateUser(userNameToUpdate: string, updatedFields: object) {
        const users = FileReaderAndWriter.readFile(FILE_PATH).users;
        const userToModify = users.find(item => item.userName === userNameToUpdate.toLowerCase());

        if (userToModify) {
            const updatedUser = {
                ...userToModify,
                ...updatedFields
            };
            const indexOfUser = users.findIndex(item => item.userName === userNameToUpdate.toLowerCase());
            users[indexOfUser] = updatedUser;
            FileReaderAndWriter.writeFile({users}, FILE_PATH);
            return updatedUser;
        }
    }
}