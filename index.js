const Discord = require("discord.js");
const Enmap = require("enmap");
const parser = require("discord-command-parser");
const fs = require("fs-extra");

const utils = require("./utils");

const token = process.env.TOKEN;
const client = new Discord.Client();

client.commands = new Discord.Collection();

console.log("running");

client.settings = new Enmap("settings");

const defaultSettings = {
    prefix: "w!",
    welcomeChannel: "welcome",
    welcomeChannelOptions: {
        permissionOverwrites: [
            {
                id: guild.id,
                allow: ["VIEW_CHANNEL"],
                deny: ["SEND_MESSAGES"],
            },
        ],
    },
    welcomeMessage: "Welcome to {{guildname}}, {{user}}",
};

client.on("ready", () => {
    console.log("Ready");
    client.user.setActivity("YOU", {type: "WATCHING"});
});

for (const filename of fs.readdirSync("./commands")) {
    if (filename.endsWith(".js")) {
        const command = require(`./commands/${filename}`);
        client.commands.set(command.name, command);
    }
}

client.on("guildMemberAdd", async (member) => {
    const {guild, user} = member;
    const {
        welcomeMessage: messageTemplate,
        welcomeChannel: channelName,
        welcomeChannelOptions: options,
    } = client.settings.get(guild.id);

    utils.getOrCreateChannelByName(guild, channelName, options)
        .then(
            channel => {
                let message = messageTemplate;
                message = message.replace("{{user}}", user.tag);
                message = message.replace("{{guildname}}", guild.name);
                message = message.replace("{{numberusers}}", guild.memberCount.toString());
                channel.send(message);
            },
            error => console.log(error),
        );
});

client.on("message", message => {
    const {content, channel, guild, author} = message;

    if (content === "test") {
        channel.send("hi");
        return;
    }

    if (content.startsWith("w!")) channel.send(`Saw message "${content}"`);

    if (author.bot || !guild) return;

    const {prefix} = client.settings.ensure(guild.id, defaultSettings);

    const parsed = parser.parse(message, prefix, {
        allowBots: false,
        allowSelf: false,
        ignorePrefixCase: false,
    });

    if (!parsed.success) {
        return;
    }

    channel.send(`Got command "${content}"`);

    const {command, arguments} = parsed;

    const handler = client.commands.get(command);

    if (!handler) {
        message.reply("invalid command");
        return;
    }

    handler.execute(client, message, arguments).catch((error) => {
        console.error(error);
        message.reply("there was an error trying to execute that command!");
    });
});

client.on("guildCreate", (guild) => {
    client.settings.ensure(guild.id, defaultSettings);
});

client.login(token);
