const { MessageEmbed } = require('discord.js');

/**
 * @type {import("nocli-handler.js").ICommand}
 */
const Command = {
    type: "BOTH",
    description: "Evaluates a JavaScript expression",
    ownerOnly: true,
    deferReply: true,
    minArgs: 1,
    expectedArgs: "<expression>",
    callback: ({ text, interaction, message, member }) => {
        const embed = new MessageEmbed()
            .setTitle("JavaScript Evaluation Result")
            .addField("Expression", '```javascript\n' + text + '\n```')
        try {
            let result = eval(text);
            if (typeof result === "object") result = JSON.stringify(result);
            embed.addField("Result", '```javascript\n' + result + '\n```');
            embed.setColor("GREEN");
            return {
                embeds: [embed],
                ephemeral: true,
            }
        } catch (error) {
            embed.addField("Result", '```bash\n' + error + '\n```');
            embed.setColor("RED");
            return {
                embeds: [embed],
                ephemeral: true,
            }
        }
    }
}

module.exports = Command;