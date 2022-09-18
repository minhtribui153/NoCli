const { Events } = require("discord.js");

const prefix = 'button-roles-'
const { check, error } = require('../../../data/emoji_config.json');

/**
 * @type {import("nocli-handler.js").IEvent<Events.InteractionCreate>}
 */
const Event = {
    description: "Handles Button roles",
    callback: (instance, interaction) => {
        const { guild, customId } = interaction
        if (!guild || !customId.startsWith(prefix)) return;
    
        const roleId = customId.replace(prefix, '')
        const member = interaction.member;
    
        if (member.roles.cache.has(roleId)) {
            member.roles.remove(roleId)

            interaction.reply({
                ephemeral: true,
                content: `${error} You no longer have the <@&${roleId}> role.`,
            })
        } else {
            member.roles.add(roleId)
    
            interaction.reply({
                ephemeral: true,
                content: `${check} You now have the <@&${roleId}> role.`,
            })
        }
    }
}

module.exports = Event;