const { Events } = require("discord.js");

/**
 * @type {import("nocli-handler.js").IEvent<Events.MessageCreate>}
 */
const Event = {
    name: "ping",
    callback: (instance, message) => {
        if (message.content === "ping") {
            message.reply("Pong!")
        }
    }
}

module.exports = Event;