import {FileReaderAndWriter} from "./FileReaderAndWriter";
import {DiscordUser} from "./DiscordUser";
import {TwitterBotCommand} from "../twitter-bot-commands";

export type PrivilegeLevels = 'public' | 'admin';

export const ORDERED_PRIVILEGE_LEVELS: PrivilegeLevels[] = [
    'public',
    'admin'
]

export class Privileges {
    static userIsPermissionedForCommand(command: TwitterBotCommand, user: DiscordUser) {
        const userPermissions = Privileges.getUserFromLocalFile(user);
        const requiredPrivilegeLevelAsNumber = ORDERED_PRIVILEGE_LEVELS
            .findIndex(level => level === command.privilegeLevel);
        const userPrivilegeLevelAsNumber = ORDERED_PRIVILEGE_LEVELS
            .findIndex(level => level === userPermissions.privilegeLevel);
        return userPrivilegeLevelAsNumber >= requiredPrivilegeLevelAsNumber;
    }

    static getUserFromLocalFile(discordUser: DiscordUser) {
        const userPermissions = FileReaderAndWriter.readFile(`/../user-permissions.json`);

        if (userPermissions) {
            const foundUser = userPermissions.users.filter(user => user.userName === discordUser.getUserNameOfMessageSender())[0];
            if (foundUser) {
                return foundUser;
            }

            const newUser = {userName: discordUser.getUserNameOfMessageSender(), privilegeLevel: 'public'};
            userPermissions.users.push(newUser);
            FileReaderAndWriter.writeFile(userPermissions, '/../user-permissions.json');
            return newUser;
        }
    }
}