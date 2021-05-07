const Discord = require('discord.js')
const mongoose = require('mongoose')
const client = require('../client')

const Panel = require('./Panel.class')

class Ticket {

    /**
     * Constructor function
     * @param {Panel} parent 
     * @param {string[]} roles 
     */
    constructor(parent, roles) {
        this.roles = roles
        this.parent = parent

        // this.controls = {
        //     '❌': () => console.log('Close')
        // }

        this.channel_id = null
        this.doc_id = null
        this._lastMessage = null
    }

    async createTicket(author) {
        const { getChannel } = this.parent

        var embed = this.createEmbed()
        var category = await getChannel(this.parent.category_id)

        var channel = await this.createChannel(category)
        var message = await channel.send(embed)

        this._lastMessage = message.id
        this.addUser(channel, author)
    }

    createEmbed() {
        const embed = new Discord.MessageEmbed()
            .setTitle('Ticket')
            .setDescription('Help will be here shortly.')
            .setColor('GREEN')

        return embed
    }

    /**
     * Crea el canal en la categoria especificada
     * @param {Discord.CategoryChannel} category 
     */
    async createChannel(category) {
        const { guild } = category

        var channel = await guild.channels.create('ticket', { parent: category, type: 'text' })
        this.channel_id = channel.id

        await this.changePermissions(channel)

        return channel
    }

    /**
     * Cambia los permisos de un canal
     * @param {Discord.TextChannel} channel 
     */
    async changePermissions(channel) {
        await channel.updateOverwrite(channel.guild.roles.everyone, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false
        })

        this.roles.forEach(async (role) => {
            await channel.updateOverwrite(role, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true
            })
        })
    }

    async addUser(channel, user) {
        await channel.updateOverwrite(user, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true
        })
    }

    async removeUser(channel, user) {
        await channel.updateOverwrite(user, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false
        })
    }
}

module.exports = Ticket