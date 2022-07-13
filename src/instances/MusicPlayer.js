const { Player } = require("@jadestudios/discord-music-player");
const { client } = require('..')

const player = new Player(client, {
    leaveOnEmpty: true,
});

module.exports = player;