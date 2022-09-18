const { NoCliCommandType } = require("nocli-handler.js");

/**
 * @type {import("nocli-handler.js").ICommand}
 */
const Command = {
    type: NoCliCommandType.Both,
    deferReply: "ephemeral",
    aliases: ["p", "pi"],
    description: "Checks client latency",
    reply: true,
    ownerOnly: true,
    cooldowns: {
        perUserPerGuild: "2 m"
    },
    callback: async ({ client, cancelCooldown, updateCooldown }) => {
        await new Promise((res, rej) => setTimeout(res, 5000));
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 10)
        cancelCooldown()
        return `🏓 Pong! \`${client.ws.ping}ms\``
    }
}

module.exports = Command;