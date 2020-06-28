export async function getOrCreateChannelByName(guild, channelName, options) {
    const channel = guild.channels.cache.find(ch => ch.name === channelName);
    if (channel) return channel;
    return guild.channels.create(channelName, options);
}

export function isOwner(app, user) {
    const {owner, members} = app;
    return owner.id === user.id || (members && members.has(user.id));
}
