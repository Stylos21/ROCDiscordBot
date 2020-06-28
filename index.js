const Discord = require('discord.js');
const Enmap = require("enmap")
const parser = require("discord-command-parser")
const token = process.env.TOKEN;
const client = new Discord.Client();
client.commands = new Discord.Collection();
const fs = require("fs-extra");
console.log("running")
client.settings = new Enmap("settings")
const defaultSettings = {
    prefix: "w!",
    welcomeChannel: "welcome",
    welcomeMessage: "Welcome to {{guildname}}, {{user}}"
}
client.on('ready', () => {
    console.log("Ready");
    client.user.setActivity("YOU", {type: "WATCHING"})
});
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
client.on('guildMemberAdd', (member) => {
    const message = client.settings.get(member.guild.id).welcomeMessage
    const configChannel = client.settings.get(member.guild.id).welcomeChannel
    let channel = member.guild.channels.find(ch=>ch.name==configChannel)
    if(!channel) {
    try {
        member.guild.channels.create("welcome", {type: "text", permissionOvewrites: [
            {
                id: guild.id,
                allow: ["VIEW_CHANNEL"],
                deny: ["SEND_MESSAGES"]
            }
        ]})} catch (error){
            console.log(error)
        }

    }
    message.replace("{{user}}", member.user.tag);
    message.replace("{{guildname}}", member.guild.name)
    message.replace("{{numberusers}}", member.guild.memberCount)
    

});
client.on('message', (message) => {
    if(message.content=="test") {
        message.channel.send("hi")
    }
    if(message.author.bot || !message.guild) return
    const prefix = client.settings.ensure(message.guild.id, defaultSettings).prefix
    const parsed = parser.parse(message, prefix, {
        allowBots: false,
        allowSelf: false,
        ignorePrefixCase: false
    });
    if(!parsed.success) {
        return
    };
    message.channel.send(`Got command "${message.content}"`);
    let command = parsed.command;
    let args = parsed.arguments;
    let cmd = client.commands.get(command)
    if(!cmd) return
    if (cmd.args==true && !args) {return message.channel.send(`${command.name} needs arguments ${message.author}!`)}
    if(message.content == "hello"){
        message.channel.send("Hello");
    }
    try {
        cmd.execute(client, message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});
client.on('guildCreate', (guild) => {
    client.settings.ensure(guild.id, defaultSettings)
});
client.login(token);
