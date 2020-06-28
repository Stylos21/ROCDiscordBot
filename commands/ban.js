module.exports = {
    name: "ban",
    description: "ban a member",
    syntax: "`ban` <user>",
    async execute(client, message, args) {
        const {member: sender, channel, guild, mentions} = message;

        if (!sender.hasPermission("BAN_MEMBERS"))
            return channel.send(`${sender}, you don't have permission to use this command!`);

        if (!guild.me.hasPermission("BAN_MEMBERS"))
            return channel.send(`${sender}, I don't have ban permissions!`);

        let target = mentions.members.first();

        try {
            await target.ban();
            channel.send(`:white_check_mark: ${target.displayName} was banned! :point_right:`);
        } catch(error) {
            channel.send(`Could not ban ${target.displayName}!`);
            console.error(error);
        }
    },
};
