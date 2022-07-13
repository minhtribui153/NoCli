const {
    MessageActionRow,
    MessageButton,
} = require('discord.js');

const buttonStyles = ['primary', 'secondary', 'success', 'danger']
const prefix = 'button-roles-'

/**
 * @type {import("nocli-handler.js").ICommand}
 */
const Command = {
    type: "BOTH",
    description: "Adds numbers together",
    options: [
        {
            name: "channel",
            description: "The channel to add the button to",
            type: "CHANNEL",
            required: true,
        },
        {
            name: "message_id",
            description: "The message ID to add the button to",
            type: "STRING",
            required: true,
        },
        {
            name: 'role',
            description: 'The role to add to the user',
            type: 'ROLE',
            required: true,
        },
        {
            name: 'emoji',
            description: 'The emoji to use for the button',
            type: 'STRING',
            required: true,
        },
        {
            name: 'button-style',
            description: 'The style of the button',
            type: 'STRING',
            required: true,
            choices: buttonStyles.map((style) => ({
                name: style,
                value: style.toUpperCase(),
            })),
        },
        {
            name: 'button-label',
            description: 'The label of the button',
            type: 'STRING',
            required: true,
        },
    ],
    init: (client) => {
        client.on('interactionCreate', (interaction) => {
          if (!interaction.isButton()) {
            return
          }
    
          const { guild, customId } = interaction
          if (!guild || !customId.startsWith(prefix)) {
            return
          }
    
          const roleId = customId.replace(prefix, '')
          const member = interaction.member;
    
          if (member.roles.cache.has(roleId)) {
            member.roles.remove(roleId)
    
            interaction.reply({
              ephemeral: true,
              content: `You no longer have the <@&${roleId}> role.`,
            })
          } else {
            member.roles.add(roleId)
    
            interaction.reply({
              ephemeral: true,
              content: `You now have the <@&${roleId}> role.`,
            })
          }
        })
      },
    
    callback: async ({ guild, message, interaction, args, member }) => {
        if (!member.permissions.has("ADMINISTRATOR")) {
            return "You do not have permissions to use this command."
        }
        // Get the channel
        args.shift()
        let channel;
        if (message) {
            channel = message.mentions.channels.first();
        } else {
            channel = interaction.options.getChannel('channel', true);
        }

        if (!channel) return "Please mention a channel";
        // Get the message
        const messageId = args.shift();
        if (!messageId || isNaN(messageId)) return "Please specify a valid message ID";
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
            return `Unknown button style. Valid styles are: "${buttonStyles.join('", "')}"`
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
                    content: 'Cannot add more buttons to this message.',
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
            content: 'Added button to role message.',
        }
    },
}

module.exports = Command;