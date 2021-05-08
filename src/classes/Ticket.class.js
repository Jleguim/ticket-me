const Discord = require('discord.js')
const mongoose = require('mongoose')
const client = require('../client')

class Ticket {
    /**
     * A ticket
     * @param {Panel} panelParent 
     */
    constructor(panelParent) {
        this.parent = null
        this.channel = null
        this.doc_id = null
        this._message = null

        // Needa check this somehow without making a circular dep
        this.parent = panelParent
    }

    /**
    * Makes an object with the instance's data for Mongo.
    * @returns Object
    */
    toJSON() {
        return {
            parent: this.parent.doc_id,
            channel: this.channel.id,
            _message: this.message
        }
    }

    /**
     * Saves the instance's data to Mongo and returns the data.
     * @returns Object
     */
    // async save() {
    //     var tObj = this.toJSON()
    //     var t = undefined

    //     if (!this.doc_id) t = new PnelModel(tObj)
    //     else t = await PnelModel.findByIdAndUpdate(this.doc_id, tObj)

    //     this.doc_id = t.id

    //     await t.save()
    //     return t
    // }

    /**
     * Makes an instance of Ticket using data from Mongo.
     * @param {Object} obj 
     * @returns Panel
     */
    // static revive({ channel, category, options, _message, id }) {
    //     var p = new Panel(channel, category, options)
    //     p._message = _message
    //     p.doc_id = id

    //     return p
    // }

    async exec(author) {
        const getChannel = this.parent.getChannel

        var embed = this.createEmbed()
        var category = (this.parent.category instanceof Discord.CategoryChannel) ? this.parent.category : getChannel(this.parent.category)

        var channelOptions = { parent: category, type: 'text' }
        var channel = await category.guild.channels.create('ticket', channelOptions)
        var message = await channel.send(embed)

        this.channel = channel
        this._message = message.id

        this.removePermission(this.channel.guild.roles.everyone)
        this.addPermission(author)
        this.parent.roles.forEach(role => this.addPermission(role))
    }

    /**
    * Creates an embed from the parent panel options.
    * @returns Embed
    */
    createEmbed() {
        var { title, message, color } = this.parent.options.tEmbed

        return new Discord.MessageEmbed()
            .setTitle(title)
            .setColor(color)
            .setFooter(message)
    }

    removePermission(id) {
        this.channel.updateOverwrite(id, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false
        })
    }

    addPermission(id) {
        this.channel.updateOverwrite(id, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true
        })
    }
}

module.exports = Ticket