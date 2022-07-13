/**
 * @type {import("nocli-handler.js").ICommand}
 */
const Command = {
    type: "BOTH",
    deferReply: true,
    aliases: ["p", "pi"],
    description: "Checks client latency",
    ownerOnly: true,
    callback: async ({ client }) => {
        await new Promise((resolve, reject) => setTimeout(resolve, 5000))
        return `🏓 Pong! \`${client.ws.ping}ms\``
    }
}

module.exports = Command;