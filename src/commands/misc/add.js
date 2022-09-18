const { NoCliCommandType } = require("nocli-handler.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

/**
 * @type {import("nocli-handler.js").ICommand}
 */
const Command = {
    type: NoCliCommandType.Both,
    description: "Adds numbers together and prints out the sum of it",
    testOnly: true,
    minArgs: 2,
    maxArgs: 3,
    cooldowns: {
        perUser: "10 m",
    },
    expectedArgs: "<Num1> <num2> [num3]",
    callback: ({ client, message, interaction, args, text, member, cancelCooldown, updateCooldown }) => {
        cancelCooldown()

        let sum = 0;
        for (const arg of args) {
            sum += parseInt(arg);
        }

        const row = new ActionRowBuilder()
        row.addComponents(
            new ButtonBuilder()
                .setCustomId('testing')
                .setLabel('Testing')
                .setEmoji('🧪')
                .setStyle(ButtonStyle.Success)
        )

        return {
            content: `The sum is: ${sum}`,
            components: [row]
        }
    }
}

module.exports = Command;