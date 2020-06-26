const Discord = require('discord.js');
const token = process.env.TOKEN

const client = new Discord.Client()

client.on('ready', () => {
    console.log("Ready");
});
client.on('message', (message) => {
    console.log(message);
    if(message.content == "hello"){
        message.channel.send("Hello");
    }
})


client.login(token)