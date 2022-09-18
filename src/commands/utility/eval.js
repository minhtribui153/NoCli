const { EmbedBuilder } = require('discord.js');
const { NoCliCommandType } = require('nocli-handler.js');

/**
 * @type {import("nocli-handler.js").ICommand}
 */
const Command = {
    type: NoCliCommandType.Both,
    description: "Evaluates a JavaScript expression",
    ownerOnly: true,
    deferReply: "ephemeral",
    minArgs: 1,
    expectedArgs: "<expression>",
    callback: ({ text }) => {
        const embed = new EmbedBuilder()
            .setTitle("JavaScript Evaluation Result")
            .addFields([
                {
                    name: "Expression",
                    value: "```javascript\n' + text + '\n```"
                }
            ])
        try {
            let result = eval(text);
            if (typeof result === "object") result = JSON.stringify(result);
            embed.addFields([
                {
                    name: "Result", 
                    value: '```javascript\n' + result + '\n```'
                }
            ])
            embed.setColor("Green");
            return {
                embeds: [embed],
                ephemeral: true,
            }
        } catch (error) {
            embed.addFields([
                {
                    name: "Result", 
                    value: '```bash\n' + error + '\n```'
                }
            ]);
            embed.setColor("Red");
            return {
                embeds: [embed],
                ephemeral: true,
            }
        }
    }
}

module.exports = Command;