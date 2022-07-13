/**
 * @type {import("nocli-handler.js").ICommand}
 */
const Command = {
    type: "BOTH",
    description: "Adds numbers together and prints out the sum of it",
    testOnly: true,
    minArgs: 2,
    maxArgs: 3,
    expectedArgs: "<Num1> <num2> [num3]",
    callback: ({ client, message, interaction, args, text }) => {
        let sum = 0;
        for (const arg of args) {
            sum += parseInt(arg);
        }
        return 'The sum is ' + sum;
    }
}

module.exports = Command;