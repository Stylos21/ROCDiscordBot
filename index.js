const Discord = require('discord.js');
const token = process.env.TOKEN;
const client = new Discord.Client();
client.commands = new Discord.Collection();
const fs = require("fs");
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


client.login(token);
