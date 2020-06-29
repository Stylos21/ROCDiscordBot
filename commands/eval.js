const path = require("path");
const _ = require("lodash");
const util = require("util");
const fs = require("fs-extra");

const {escapeDiscordMessage, isOwner} = require("../utils");

module.exports = {
    name: "eval",
    description: "Execute JavaScript Code",
    enabled: true,
    syntax: "eval [-s] <JavaScript code>",
    aliases: [""],
    hidden: true,
    async execute(client, message, args) {
        const app = await client.fetchApplication();
        if (isOwner(app, message.author))
            return message.reply(`You are not authorized to run this command!`);

        let silent = false;
        if (args[0] === "-s") {
            silent = true;
            args.shift();
        }

        const cleanMessage = text => {
            return escapeDiscordMessage(text)
                .replace(
                    new RegExp(_.escapeRegExp(client.token), "gi"),
                    "<token removed>",
                ).replace(
                    new RegExp(_.escapeRegExp(process.env.DISCORD_SECRET), "gi"),
                    "<token removed>",
                );
        };

        try {
            const code = args.join(" ");
            let result = eval(code);
            console.log(`Trying to evaluate ${code}`);

            if (!silent) message.channel.send(
                cleanMessage(util.inspect(result)),
                {code: "js", split: true},
            );
        } catch (err) {
            console.error(err);

            if (!silent) message.channel.send(
                `ERROR \`\`\`js\n${cleanMessage(util.inspect(result))}\n\`\`\``,
            );
        }
    },
};
