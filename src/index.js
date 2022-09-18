require('dotenv/config');
const { Client, Partials, IntentsBitField } = require('discord.js');

const NoCliHandler = require('nocli-handler.js').default;
const path = require('path');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessageTyping
    ],
    partials: [Partials.Channel, Partials.Message],
});

const instance = new NoCliHandler({
    client,
    mongoDB: {
        uri: process.env.MONGO_URI,
        options: { keepAlive: true },
    },
    configuration: {
        defaultPrefix: "",
        commandsDir: path.join(__dirname, 'commands'),
        events: {
            dir: path.join(__dirname, 'events'),
            validations: {
                interactionCreate: {
                    isButton: interaction => interaction.isButton(),
                },
            }
        },
    },
    debugging: {
        showFullErrorLog: false,
        showBanner: true,
    },
    cooldownConfig: {
        defaultErrorMessage: "Please wait for [TIME]",
        botOwnersBypass: false,
        dbRequired: 500 // 5 minutes
    },
    testServers: ['847276814169669633', '789041271670177803'],
    botOwners: [],
    language: "JavaScript",
    disabledDefaultCommands: ["channelcommand"],
    emojiConfig: {
        disabled: "<:switch_false:1011202284174192670>",
        enabled: "<:switch_true:1011202296694194256>",
        error: "<:nocli_error:999917634176946216>",
        info: "<:nocli_info:999920952819339314>",
        success: "<:nocli_checkmark:999917636072771698>"
    }
});

client.login(process.env.TOKEN)

module.exports.client = client;