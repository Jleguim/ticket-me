const Discord = require('discord.js')
const mongoose = require('mongoose')
const client = require('../client')

const Ticket = require('./Ticket.class')

const PanelOptions = require('./PanelOptions.class')
const PanelModel = mongoose.models.Panel

class Panel {
    constructor(channel_id, category_id, options = new PanelOptions()) {
        this.channel_id = channel_id
        this.category_id = category_id
        this.options = options

        this.doc_id = null
        this._lastMessage = null
    }

    set lastMessage(v) {
        this._lastMessage = v

        PanelModel.findById(this.doc_id, (err, p) => {
            if (err) throw err
            p._lastMessage = v
            p.save()
        })
    }

    static revive(element) {
        var { channel_id, category_id, options, _lastMessage } = element

        var po = PanelOptions.revive(options)
        var p = new Panel(channel_id, category_id, po)

        p._lastMessage = _lastMessage
        p.doc_id = element.id

        return p
    }

    toJSON() {
        return {
            channel_id: this.channel_id,
            category_id: this.category_id,
            options: this.options.toJSON(),

            _lastMessage: this._lastMessage
        }
    }

    /**
     * Manda el mensaje con su ReactionCollector
     */
    async sendPanel() {
        const embed = this.createEmbed()
        const channel = await this.getChannel(this.channel_id)

        const message = await channel.send(embed)
        message.react(this.options.emoji)

        this.lastMessage = message.id

        this.attachCollector(message)
    }

    /**
     * Busca el canal por su ID
     * @param {string} id
     * @returns {Discord.Channel} channel
     */
    async getChannel(id) {
        var channel = await client.channels.fetch(id)
        if (!channel) throw err
        else return channel
    }

    /**
     * Crea el MessageEmbed
     * @returns {Discord.MessageEmbed} embed
     */
    createEmbed() {
        const embed = new Discord.MessageEmbed()
            .setTitle(this.options.embed.title)
            .setDescription(this.options.embed.description)
            .setColor(this.options.embed.color)

        return embed
    }

    /**
     * Le pone un ReactionCollector al mensaje
     * @param {Discord.Message} message 
     */
    attachCollector(message) {
        const collector = new Discord.ReactionCollector(message, (r, u) => !u.bot, {})

        collector.on('collect', async (reaction, user) => {
            // const category = await this.getChannel(this.category_id)
            if (reaction.emoji.name == this.options.emoji) {
                // console.log(`${user.username} created a ticket.`)

                var myTicket = new Ticket(this, [])
                await myTicket.createTicket(user)
            }

            reaction.users.remove(user.id)
        })
    }
}

module.exports = Panel