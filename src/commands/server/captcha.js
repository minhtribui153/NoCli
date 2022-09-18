const { Captcha } = require('captcha-canvas');
const { NoCliCommandType } = require('nocli-handler.js');
const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment, ApplicationCommandOptionType } = require('discord.js');
const { check, error, info, locked, unlocked } = require('../../data/emoji_config.json');

const prefix = 'captcha_verification_'

const explain_captcha = `
__**${info} Why do you need to verify your account?**__
This server is protected by the NoCli Captcha System to prevent server raids and prevent malicious users from abusing the server.
To gain access to this server, you will need to verify yourself by completing a captcha.
`

/**
 * @type {import("nocli-handler.js").ICommand}
 */
const Command = {
    type: NoCliCommandType.Both,
    description: "Deploys a Captcha for verification",
    minArgs: 1,
    expectedArgs: "<role> [text]",
    permissions: ["Administrator"],
    options: [
        {
            name: "role",
            description: "The role to add to the user when verified",
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
        {
            name: "text",
            description: "The text to display on the captcha",
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    guildOnly: true,
    testOnly: false,
    init: (client, instance) => {
        client.on("interactionCreate", async interaction => {
            if (interaction.isButton()) {
                if (interaction.customId.startsWith(prefix)) {
                    const member = interaction.guild.members.cache.get(interaction.user.id);
                    if (interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                        content: `${error} You're a server admin, so you don't need to verify yourself`,
                        ephemeral: true,
                    });
                    const roleId = interaction.customId.replace(prefix, '');
                    if (member.roles.cache.has(roleId)) return interaction.reply({
                        content: `${error} You already have been verified`,
                        ephemeral: true,
                    });
                    const captcha = new Captcha();
                    captcha.async = true;
                    captcha.addDecoy({ total: 50, color: "#48aba3" });
                    captcha.drawTrace({ color: "#48aba3" });
                    captcha.drawCaptcha();
    
                    const captchaAttachment = new MessageAttachment(await captcha.png, 'captcha.png');
    
                    interaction.reply({
                        content: `Check your DMs!`,
                        ephemeral: true,
                    });
    
                    const timeOut = 15;
    
                    const msg = await member.send({
                        content: `👋 Hey there! To verify your account, please solve the captcha below:`,
                        files: [captchaAttachment],
                    })
    
                    const filter = (message) => message.author.id === member.id;
                    const collector = msg.channel.createMessageCollector({ filter, time: timeOut * 1000 });
    
                    collector.on("collect", async (message) => {
                        if (message.content === captcha.text) {
                            interaction.guild.systemChannel
                                ? interaction.guild.systemChannel.send(`${info} ${member} has verified their account! Welcome to the server!`)
                                : "";
                            member.send(`${check} Captcha verified!`);
                            const role = interaction.guild.roles.cache.get(roleId);
                            if (role) await member.roles.add(role);

                            collector.stop("finished");
                        } else {
                            member.send(`${error} Invalid captcha! Please try again!`);
                        }
                    });
                    collector.on("end", (collected, reason) => {
                        if (reason === "time") {
                            member.send("⏰ Captcha timed out! Please try again by clicking the \"Verify\" button again!");
                            interaction.guild.systemChannel
                                ? interaction.guild.systemChannel.send(`${info} ${member} failed to verify their account!`)
                                : "";
                        }
                    });
                } else if (interaction.customId === "captcha_explain") {
                    interaction.reply({
                        content: explain_captcha,
                        ephemeral: true,
                    });
                }
            }
        });
    },
    callback: async ({ message, interaction, guild, args }) => {
        const role = message
            ? message.mentions.roles.first()
            : interaction.options.getRole('role', true);
        
        args.shift()

        const text = args.join(" ") || `Please verify your account before you can join the server.`;
        
        // Check if bot's role is above the role specified
        if (guild.me.roles.highest.comparePositionTo(role) < 0)
            return `${error} I don't have permission to assign that role! Please make sure my role is above the role you specified!`;

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
            .setTitle(`${locked} Member Verification Required`)
            .setDescription(text);
        const row = new MessageActionRow()
            .addComponents(
                [
                    new MessageButton()
                        .setLabel("Verify")
                        .setCustomId(prefix + role.id)
                        .setStyle("PRIMARY")
                        .setEmoji(unlocked),
                    new MessageButton()
                        .setLabel("Why")
                        .setCustomId("captcha_explain")
                        .setStyle("SECONDARY")
                        .setEmoji(info),
                ]
            );
        return {
            embeds: [embed],
            components: [row],
        }
    }

}

module.exports = Command;