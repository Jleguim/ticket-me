const Discord = require('discord.js')
const client = require('../client')

// const Panel = require('../classes/Panel.class')
const { createPanel, getPanels } = require('../panels')

/**
 * Runs the command
 * @param {Discord.Message} message 
 * @param {string[]} args 
 */
async function run(message, args) {
    const panelChannel = message.mentions.channels.first()

    const panelChannelID = (panelChannel) ? panelChannel.id : (args[0]) ? args[0] : null
    const categoryChannelID = (args[1]) ? args[1] : null

    if (!panelChannelID) return message.channel.send('You forgot the text channel.')
    if (!categoryChannelID) return message.channel.send('You forgot the category.')

    const isTextChannel = await checkType(panelChannelID, 'text')
    const isCategory = await checkType(categoryChannelID, 'category')

    if (!isTextChannel) return message.channel.send('Not a valid text channel.')
    if (!isCategory) return message.channel.send('Not a valid category.')

    const newPanel = createPanel(panelChannelID, categoryChannelID)
    await newPanel.sendPanel()

    // const newPanel = new Panel(panelChannelID, categoryChannelID)

    // newPanel.options.setTitle('XD')
    // newPanel.options.setDescription('Manda tu vaina fea')
    // newPanel.options.setColor('RED')
    // newPanel.options.setEmoji('✔️')

    // await newPanel.sendPanel()
}

module.exports = { run }

async function checkType(id, type) { /* Checkea si la id es un canal y su tipo */
    try {
        const channel = await client.channels.fetch(id)
        if (!channel) return false
    
        return (channel.type == type)
    } catch (error) {
        return false
    }
}
