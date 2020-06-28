const {exec: execCallback} = require("child_process");
const util = require("util");

const exec = util.promisify(execCallback);

module.exports = {
    name: "version",
    description: "Display the current version of ROCDiscordBot",
    async execute(client, message, args) {
        const {channel} = client;
        let {stdout} = await exec("git rev-parse HEAD");
        channel.send(stdout);
    },
};
