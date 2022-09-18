const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const { NoCliCommandType } = require("nocli-handler.js");

/**
 * @type {import("nocli-handler.js").ICommand}
 */
const Command = {
    type: NoCliCommandType.Both,
    description: "Checks what device you are using",
    testOnly: true,
    minArgs: 1,
    permissions: [PermissionFlagsBits.Administrator],
    maxArgs: 1,
    guildOnly: true,
    expectedArgs: "<type>",
    options: [
        {
            name: "type",
            description: "The device you are using",
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
            required: true,
        }
    ],
    autocomplete: () => {
        return ["Desktop", "Laptop", "Phone", "Tablet"]
    },
    callback: ({ client, message, interaction, args, text, cancelCooldown, updateCooldown }) => {
        return `You chose ${interaction.options.get("type", true).value}`
    }
}

module.exports = Command;