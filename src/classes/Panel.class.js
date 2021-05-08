const Discord = require('discord.js')
const mongoose = require('mongoose')
const client = require('../client')

const Ticket = require('./Ticket.class')

const PanelModel = mongoose.models.Panel

var defaultOptions = {
    pEmbed: {
        title: 'My panel',
        color: 'BLUE',
        message: 'React with $EMOJI to make a ticket.'
    },
    tEmbed: {
        title: 'Ticket',
        color: 'GREEN',
        message: 'Support will arrive soon.'
    },
    emoji: '📧'
}

class Panel {
    /**
     * A ticket panel
     * @param {string | Discord.TextChannel} channelResolvable 
     * @param {srting | Discord.CategoryChannel} categoryResolvable 
     * @param {string | Discord.Role} roles
     * @param {defaultOptions} options 
     */
    constructor(channelResolvable, categoryResolvable, roles = [], options = defaultOptions) {
        this.channel = undefined
        this.category = undefined
        this.roles = roles
        this.options = undefined
        this.doc_id = undefined
        this._message = undefined

        if (channelResolvable instanceof Discord.TextChannel) this.channel = channelResolvable
        else if (channelResolvable instanceof String) {
            client.channels.fetch(channelResolvable).then(ch => {
                this.channel = ch
            })
        } else throw 'Invalid channelResolvable'

        if (categoryResolvable instanceof Discord.CategoryChannel) this.category = categoryResolvable
        else if (channelResolvable instanceof String) {
            client.channels.fetch(channelResolvable).then(ch => {
                this.category = ch
            })
        } else throw 'Invalid categoryResolvable'

        if (options instanceof Object) this.options = options
        else throw 'Invalid options'
    }

    /**
     * Makes an object with the instance's data for Mongo.
     * @returns Object
     */
    toJSON() {
        return {
            channel: (this.channel instanceof Discord.TextChannel) ? this.channel.id : this.channel,
            category: (this.category instanceof Discord.CategoryChannel) ? this.category.id : this.category,
            roles: this.roles,
            options: this.options,

            _message: this.message
        }
    }

    /**
     * Saves the instance's data to Mongo and returns the data.
     * @returns Object
     */
    async save() {
        var pObj = this.toJSON()
        var p = undefined

        if (!this.doc_id) p = new PanelModel(pObj)
        else p = await PanelModel.findByIdAndUpdate(this.doc_id, pObj)

        this.doc_id = p.id

        await p.save()
        return p
    }

    /**
     * Makes an instance of Panel using data from Mongo.
     * @param {Object} obj 
     * @returns Panel
     */
    static revive({ channel, category, options, _message, id }) {
        var p = new Panel(channel, category, options)
        p._message = _message
        p.doc_id = id

        return p
    }

    /**
     * Executes the panel's functionality
     */
    async exec() {
        var embed = this.createEmbed()
        var channel = (this.channel instanceof Discord.TextChannel) ? this.channel : this.getChannel(this.channel)
        var message = await channel.send(embed)

        this._message = message.id
        await message.react(this.options.emoji)
        await this.save()

        const collector = new Discord.ReactionCollector(message, (r, u) => !u.bot)
        collector.on('collect', async (reaction, user) => {
            if (reaction.emoji.name == this.options.emoji) {
                var ticket = new Ticket(this)
                await ticket.exec(user)
            }

            reaction.users.remove(user.id)
        })
    }

    /**
     * Creates an embed from the panel options.
     * @returns Embed
     */
    createEmbed() {
        var { title, message, color } = this.options.pEmbed

        return new Discord.MessageEmbed()
            .setTitle(title)
            .setColor(color)
            .setFooter(message.replace('$EMOJI', this.options.emoji))
    }

    async getChannel(id) {
        var channel = await client.channels.fetch(id)
        if (!channel) throw err
        else return channel
    }
}

module.exports = Panel