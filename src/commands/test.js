const Discord = require('discord.js')
const client = require('../client')

async function run(message, args) {
    console.log('Tested!')
    message.channel.send('Tested!')

    if (args[0] == '1') {
        args.shift()

        var log = ''
        args.forEach(arg => {
            log += `${args[1]} is of type ${typeof args[1]}\n`
        })

        console.log(log)
        message.channel.send(log)
    }
}

module.exports = { run }