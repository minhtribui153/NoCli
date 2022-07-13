const { createWorker } = require('tesseract.js');

/**
 * @type {import("nocli-handler.js").ICommand}
 */
const Command = {
    type: "BOTH",
    description: "translate images",
    testOnly: true,
    options: [
        {
            name: "image",
            description: "image to translate",
            type: 'ATTACHMENT',
            required: true,
        }
    ],
    callback: async ({ client, message, interaction }) => {
        const image = message
            ? message.attachments.first()
            : interaction.options.getAttachment('image', true);
        if (!image) return "Please attach an image to translate";
        
        const imageUrl = image.url.toLowerCase();

        if (!imageUrl.endsWith('png') && !imageUrl.endsWith('jpg') && !imageUrl.endsWith('jpeg'))
            return "Please attach a valid image with correct format (.png, .jpg, .jpeg)";
            
        const msg = message
            ? await message.reply("<a:loading_barline:986190260276953118> Translating Image...")
            : interaction.reply("<a:loading_barline:986190260276953118> Translating Image...");
        let hasError = false;
        try {
            const worker = createWorker();
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const result = await worker.recognize(imageUrl)
            if (hasError) return;
            await worker.terminate();
            if (interaction) return interaction.editReply(`\`\`\`${result.data.text}\`\`\``);
            else return await msg.edit(`\`\`\`${result.data.text}\`\`\``);
        } catch (error) {
            if (interaction) return interaction.editReply("An error occured while translating the image");
            else return await msg.edit("An error occured while translating the image");
        }
    }
}

module.exports = Command;