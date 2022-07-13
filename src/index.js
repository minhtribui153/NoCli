require('dotenv/config');
const { Client, Intents, version } = require('discord.js');
const NoCliHandler = require('nocli-handler.js').default;
const path = require('path');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
    ],
    partials: ["CHANNEL"],
});

const instance = new NoCliHandler({
    client,                                    // The Discord.JS Client you initialized
    mongoDB: {
        uri: process.env.MONGO_URI,            // The MongoDB URI
        options: {}                            // The MongoDB options (optional)
    },
    configuration: {
        defaultPrefix: "",                     // Sets the default prefix (default = "!")
        commandsDir: path.join(__dirname, 'commands'), // Sets the directory where the commands are located
        featuresDir: path.join(__dirname, ''), // Sets the directory where the features are located (will be implemented in the next version)
    },
    debugging: {
        showFullErrorLog: false,               // Whether or not to show the full error log (default = false)
        showBanner: true,                      // Whether or not to show the banner upon the start of the program (default = true)
    },
    clientVersion: version,                  // Your current Discord.JS version
    testServers: ['847276814169669633', '789041271670177803'],    // Array of server IDs that will be used for testing (default = [])
    botOwners: ['710319131983085599'],    // Array of user IDs that are the bot owners (default = [])
    language: "JavaScript",                    // The language you are using to develop your Discord.JS Bot
});

client.login(process.env.TOKEN)

module.exports.client = client;