require('dotenv/config');
const DiscordJS = require('discord.js');

const client = new DiscordJS.Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
    console.log('[INFO] Bot is ready!');
});

client.login(process.env.TOKEN)