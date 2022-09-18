const { MessageActionRow, MessageButton, ApplicationCommandOptionType } = require('discord.js');
const { NoCliCommandType } = require('nocli-handler.js');


const buttonStyles = ['primary', 'secondary', 'success', 'danger']
const prefix = 'button-roles-'
const { check, error } = require('../../data/emoji_config.json');

/**
 * @type {import("nocli-handler.js").ICommand}
 */
const Command = {
    type: NoCliCommandType.Slash,
    description: "Adds numbers together",
    options: [
        {
            name: "channel",
            description: "The channel to add the button to",
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: "message_id",
            description: "The message ID to add the button to",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'role',
            description: 'The role to add to the user',
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
        {
            name: 'emoji',
            description: 'The emoji to use for the button',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'button-style',
            description: 'The style of the button',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: buttonStyles.map((style) => ({
                name: style,
                value: style.toUpperCase(),
            })),
        },
        {
            name: 'button-label',
            description: 'The label of the button',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    
    callback: async ({ guild, message, interaction, args, member }) => {
        if (!member.permissions.has("ADMINISTRATOR")) {
            return `${error} You do not have permissions to use this command.`
        }
        // Get the channel
        args.shift()
        let channel;
        if (message) {
            channel = message.mentions.channels.first();
        } else {
            channel = interaction.options.getChannel('channel', true);
        }

        if (!channel) return `${error} Please mention a channel`;
        // Get the message
        const messageId = args.shift();
        if (!messageId || isNaN(messageId)) return `${error} Please specify a valid message ID`;
        // Remove the role from the arguments
        args.shift()

        // Get the role
        let role
        if (message) {
            role = message.mentions.roles.first()
        } else {
            role = interaction.options.getRole('role')
        }

        // Get the emoji
        const emoji = args.shift()

        // Get the button style
        const buttonStyle = args.shift() || 'primary'
        if (!buttonStyles.includes(buttonStyle.toLowerCase())) {
            // "primary", "secondary", "success", "danger"
            return `${error} Unknown button style. Valid styles are: "${buttonStyles.join('", "')}"`
        }

        // Get the button label
        const buttonLabel = args.join(' ')
        const roleMessage = await channel.messages.fetch(messageId)

        const rows = roleMessage.components
        const button = new MessageButton()
            .setLabel(buttonLabel)
            .setEmoji(emoji)
            .setStyle(buttonStyle)
            .setCustomId(`${prefix}${role.id}`)
        let added = false

        for (const row of rows) {
            if (row.components.length < 5) {
            row.addComponents(button)
            added = true
            break
            }
        }

        if (!added) {
            if (rows.length >= 5) {
                return {
                    custom: true,
                    ephemeral: true,
                    content: `${error} Cannot add more buttons to this message.`,
                }
            }

            rows.push(new MessageActionRow().addComponents(button))
        }

        roleMessage.edit({
            components: rows,
        })

        return {
            custom: true,
            ephemeral: true,
            content: `${check} Added button to role message.`,
        }
    },
}

module.exports = Command;