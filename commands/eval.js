const path = require("path");
const _ = require("lodash");
const wait = require("util").promisify((x)=>setTimeout(null, x));
const fs = require("fs-extra");
module.exports = {
  name: "eval",
  description: "Execute JavaScript Code",
  enabled: true,
  syntax: "eval [-s] <JavaScript code>",
  aliases: [""],
  hidden: true,
  async execute(client, message, args) { 
    if(!client.config.owners.includes(message.author.id)) return message.reply(`You are not authorized to run this command!`);
    let silent = false;
    if (args[0] ==  "-s") {
      silent = true; 
      args.shift();
    }
      const clean = text => {
        if (typeof text === "string")
          return text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
        else return text;
      };
      const escapeRegExp = str => {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
      };
        try {
          const code = args.join(" ");
          let evaled = await eval(code);
          console.log(`Trying to evaluate ${code}`);
          if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);
          evaled = evaled
            .toString()
            .replace(
              new RegExp(escapeRegExp(client.token), "gi"),
              "<token removed>"
            ).replace(
              new RegExp(escapeRegExp(process.env.DISCORD_SECRET), "gi"),
              "<token removed>"
            )
          if(!silent) message.channel.send(clean(evaled), { code: "xl", split: true });
        } catch (err) {
          console.error(err);
          if(!silent) message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
      }
};
