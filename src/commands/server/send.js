/**
 * @type {import("nocli-handler.js").ICommand}
 */
const Command = {
    type: "BOTH",
    description: "Sends a message to a channel",
    minArgs: 2,
    maxArgs: 2,
    expectedArgs: "<channel> <message>",
    options: [
        {
            name: "channel",
            description: "The channel to send the message to",
            type: "CHANNEL",
            required: true,
        },
        {
            name: "message",
            description: "The message to send",
            type: "STRING",
            required: true,
        }
    ],
    callback: async ({ client, args }) => {
        const id = args[0].replace(/[<#>]/g, '');
        const targetChannel = await client.channels.cache.get(id);
        
        if (!targetChannel) return "Please specify a valid channel";

        const messageContent = args.slice(1).join(" ");
        
        targetChannel.send(messageContent);
        return {
            content: `Sent message to <#${targetChannel.id}>`,
            ephemeral: true,
        }
    }
};

module.exports = Command;