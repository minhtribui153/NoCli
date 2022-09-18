const { NoCliCommandType } = require("nocli-handler.js")

/**
 * @type {import("nocli-handler.js").ICommand}
 */
const Command = {
    description: "Clears messages possible in a channel",
    type: NoCliCommandType.Both,
    deferReply: true,
    guildOnly: true,
    minArgs: 1,
    expectedArgs: "<amount>",
    callback: async ({ args, guild, channel }) => {
        const amount = parseInt(args[0])
        if (isNaN(amount)) return `"${amount}" is not a number`
        /**
         * @type {import("discord.js").TextChannel}
         */
         const textChannel = channel
         const data = await textChannel.bulkDelete(amount, true)
         const count = data.map(msg => msg).length

        return `Deleted ${count} messages`
    }
}

module.exports = Command