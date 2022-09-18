const { Events } = require("discord.js");

/**
 * @type {import("nocli-handler.js").IEvent<Events.InteractionCreate>}
 */
const Event = {
    name: "add",
    callback: (instance, interaction) => {
        if (interaction.customId === "testing") {
            interaction.reply({
                content: "Test works",
                ephemeral: true
            })
        }
    }
}

module.exports = Event;