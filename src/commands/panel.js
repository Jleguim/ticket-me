const Discord = require('discord.js')
const client = require('../client')

const Form = require('../classes/Form.class')
const Panel = require('../classes/Panel.class')

async function run(message, args) {
    var questions = [
        {
            q: 'Where do you want the panel embed to be sent? (channel id)',
            err: 'Please try again with a valid channel ID.',
            f: validate('text')
        },
        {
            q: 'Where do you want the tickets to be made? (category id)',
            err: 'Please try again with a valid category ID.',
            f: validate('category')
        },
        {
            q: 'Tag the roles that will have access to view tickets created using this panel. (@Role)',
            err: 'Please try again.',
            f: (v) => {
                var tags = v.split(' ')
                tags = tags.map((i) => i.slice(3, i.length-1))

                var existing = []
                tags.forEach(id => {
                    var exists = message.guild.roles.cache.get(id)
                    if (!exists) return
                    else existing.push(id)
                })

                if (existing.length == 0) return false
                else return existing
            }
        }
    ]

    var form = new Form(message.author, message.channel, questions)
    form.exec()

    form.callback = async ([channel, category, roles], messagesToDelete) => {
        const newPanel = new Panel(channel, category, roles)
        await newPanel.exec()

        message.channel.send('Created a panel on <#' + channel + '>')
        message.channel.bulkDelete(messagesToDelete)
    }
}

module.exports = { run }

function validate(type) {
    return (content) => {
        var id = content.split(' ')[0]
        var channel = client.channels.cache.get(id)

        if (!channel) return false
        else if (channel.type !== type) return false
        else return channel
    }
}