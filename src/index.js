require('dotenv').config()

const Discord = require('discord.js')
const mongoose = require('mongoose')
const fs = require('fs')

const client = require('./client')

mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) throw err

    fs.readdirSync('./src/models/').forEach(file => require(`./models/${file}`))

    const panels = require('./panels')

    client.on('ready', async () => {
        console.log('Ta ready en ' + client.guilds.cache.size)

        // Revivir Panels
        const ps = await panels.loadPanels()
        ps.forEach(async (panel) => {
            const channel = await client.channels.fetch(panel.channel_id)
            const message = await channel.messages.fetch(panel._lastMessage)
            panel.attachCollector(message)
        })
    })

    client.on('message', (message) => {
        const prefix = '.'

        if (!message.content.startsWith(prefix)) return
        // if (message.channel.type != 'text') return
        if (message.author.bot) return

        const args = message.content.slice(prefix.length).split(' ')
        const command = args.shift().toLowerCase()

        if (fs.existsSync(`./src/commands/${command}.js`)) {
            const cmd = require(`./commands/${command}.js`)
            cmd.run(message, args)
        }
    })

    client.login(process.env.TOKEN)
})