/**
 * 
 * @param {string} channelMention 
 * @returns {string}
 */
function resolveChannelID(channelMention) {
    const resolved = channelMention.replace(/[<#] [>]/g, '');
    return resolved;
}

module.exports = resolveChannelID;