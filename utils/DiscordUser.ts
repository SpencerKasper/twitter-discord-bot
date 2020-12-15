export class DiscordUser {
    static getUsername(msg, client) {
        const user = msg.member.toString();
        let userSearchCode;

        if (user.includes("!")) {
            userSearchCode = this.extractUserSearchCode(user, '!');
        } else {
            userSearchCode = this.extractUserSearchCode(user, '@');
        }

        return client.users.get(userSearchCode).username;
    }

    private static extractUserSearchCode(user: string, separator) {
        return user.split(separator)[1].split(">")[0];
    }
}