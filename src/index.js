require('dotenv').config()

const Discord = require('discord.js')
const mongoose = require('mongoose')
const fs = require('fs')

const client = require('./client')

mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true }, (err) => {
    if (err) throw err

    fs.readdirSync('./src/models/').forEach(file => require(`./models/${file}`))


    client.on('ready', async () => {
        console.log('Ta ready en ' + client.guilds.cache.size)

        // Revive Panels
        const Panel = require('./classes/Panel.class')
        const PanelModel = mongoose.models.Panel

        const panels = await PanelModel.find()
        panels.forEach(async (doc) => {
            Panel.revive(doc)
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