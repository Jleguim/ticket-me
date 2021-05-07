const Discord = require('discord.js')
const client = require('../client')

class PanelOptions {
    constructor(
        embedSettings = { title: 'Panel', color: 'BLUE', description: 'React to make a ticket.' },
        //ticketSettings = {  },
        emoji = '📧'
    ) {
        this.embed = embedSettings
        this.emoji = emoji
    }

    static revive(obj) {
        return new PanelOptions(obj.embed, obj.emoji)
    }

    toJSON() {
        return {
            embed: this.embed,
            emoji: this.emoji
        }
    }

    get getTitle() { return this.embed.title }
    set setTitle(v) { this.embed.title = v; return this }

    get getColor() { return this.embed.color }
    set setColor(v) { this.embed.color = v; return this }

    get getDescription() {return this.embed.description}
    set setDescription(v) { this.embed.description = v; return this }

    get getEmoji() { return this.emoji }
    set setEmoji(v) { this.emoji = v; return this }
}

module.exports = PanelOptions