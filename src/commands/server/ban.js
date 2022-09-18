const { ApplicationCommandOptionType } = require("discord.js");
const { NoCliCommandType } = require("nocli-handler.js");

/**
 * @type {import("nocli-handler.js").ICommand}
 */
const Command = {
    description: "Bans a user from the server",
    
    type: NoCliCommandType.Both,
    guildOnly: true,

    minArgs: 1,
    expectedArgs: "<user> [reason]",
    permissions: ["Administrator"],
    expectedArgsTypes: [ApplicationCommandOptionType.User, ApplicationCommandOptionType.String],

    callback: ({ member, args, message, interaction }) => {
        const targetMember = message ? message.mentions.members.first() : interaction.options.getMember('member', true);
        args.shift();
        const reason = args.join(' ');

        if (!targetMember) return {
            content: `No user was specified`,
            ephemeral: true,
        }

        if (!targetMember.bannable) return {
            content: `I have no permission to ban ${targetMember}`,
            ephemeral: true,
        }

        if (member.roles.highest.position < targetMember.roles.highest.position) return {
            content: `You have no permission to ban ${targetMember}`,
            ephemeral: true,
        }

        let text = ''
        
        targetMember.ban({ reason })
            .then(() => text = `${targetMember} was successfully banned from the server. Reason: ${reason.length ? reason : "None"}`)
            .catch(() => text = `Unable to ban ${targetMember}`);

        return text;
    }
}

module.exports = Command;