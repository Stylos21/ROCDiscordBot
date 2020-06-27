const Discord = require('discord.js');
const Enmap = require("enmap")
const token = process.env.TOKEN;
const client = new Discord.Client();
client.commands = new Discord.Collection();
const fs = require("fs");
client.settings = new Enmap("settings")
const defaultSettings = {
    prefix: "w!",
    welcomeChannel: "#welcome",
    welcomeMessage: "Welcome to {{guildname}}, {{user}}"
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
