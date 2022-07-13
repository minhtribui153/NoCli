const { Captcha } = require('captcha-canvas');
const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');

const prefix = 'captcha_verification_'

/**
 * @type {import("nocli-handler.js").ICommand}
 */
const Command = {
    type: "BOTH",
    description: "Deploys a Captcha for verification",
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<role> ",
    options: [
        {
            name: "role",
            description: "The role to add to the user when verified",
            type: "ROLE",
            required: true,
        }
    ],
    guildOnly: true,
    testOnly: false,
    init: (client) => {
        client.on("interactionCreate", async interaction => {
            if (interaction.isButton() && interaction.customId.startsWith(prefix)) {
                const member = interaction.guild.members.cache.get(interaction.user.id);
                if (interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                    content: "You're a server admin, so you don't need to verify yourself bruh 🤦‍♂️",
                    ephemeral: true,
                });
                const roleId = interaction.customId.replace(prefix, '');
                if (member.roles.cache.has(roleId)) return interaction.reply({
                    content: "You already have been verified 🤦‍♂️",
                    ephemeral: true,
                });
                const captcha = new Captcha();
                captcha.async = true;
                captcha.addDecoy({ total: 35, color: "#48aba3" });
                captcha.drawTrace({ color: "#48aba3" });
                captcha.drawCaptcha();

                const captchaAttachment = new MessageAttachment(await captcha.png, 'captcha.png');

                interaction.reply({
                    content: `Check your DMs!`,
                    ephemeral: true,
                });

                const timeOut = 15;

                const msg = await member.send({
                    content: `ℹ️ You have ${timeOut} seconds. Please solve the captcha image below:`,
                    files: [captchaAttachment],
                })

                const filter = (message) => message.author.id === member.id;
                const collector = msg.channel.createMessageCollector({ filter, time: timeOut * 1000 });

                collector.on("collect", async (message) => {
                    if (message.content === captcha.text) {
                        const role = interaction.guild.roles.cache.get(roleId);
                        if (role) interaction.member.roles.add(role);
                        member.send("✅ Captcha verified! Welcome to the server!");
                        interaction.guild.systemChannel
                            ? interaction.guild.systemChannel.send(`ℹ️ ${member} has verified their account! Welcome to the server!`)
                            : "";
                        collector.stop("finished");
                    } else {
                        member.send("❌ Invalid captcha! Please try again!");
                    }
                });
                collector.on("end", (collected, reason) => {
                    if (reason === "time") member.send("⚠️ You ran out of time to do this captcha! Please try again by clicking back the \"Verify Me\" button.");
                })
            }
        });
    },
    callback: async ({ message, interaction, guild }) => {
        const role = message
            ? message.mentions.roles.first()
            : interaction.options.getRole('role', true);

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
            .setTitle("Server Verification")
            .setDescription(`Before you can join, you must verify your account!`);
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("Verify Me")
                    .setCustomId(prefix + role.id)
                    .setStyle("PRIMARY")
                    .setEmoji("✅")
            );
        return {
            embeds: [embed],
            components: [row],
        }
    }

}

module.exports = Command;