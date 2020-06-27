const Discord = require('discord.js');
const Enmap = require("enmap")
const token = process.env.TOKEN;
const client = new Discord.Client();
client.commands = new Discord.Collection();
const fs = require("fs");
client.settings = new Enmap("settings")
const defaultSettings = {
    prefix: "w!",
    welcomeChannel: "725802580428718081",
    async welcome(user) {
        const channel = client.channels.cache.get(this.welcomeChannel);
        if(channel) {
            message.channel.send()
        }
    }
}
client.on('ready', () => {
    console.log("Ready");
    client.setActivity("YOU", {type: "WATCHING"})
});
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
client.on('message', (message) => {
    if(message.author.bot || !message.guild)
    console.log(message);
    if(message.content == "hello"){
        message.channel.send("Hello");
    }
});
client.on('guildCreate', (guild) => {
    client.settings.ensure(guild.id, defaultSettings)
});

client.login(token);
