const mongoose = require('mongoose')
const Discord = require('discord.js')

const ObjectId = mongoose.SchemaTypes.ObjectId

const PanelSchema = new mongoose.Schema({
    channel_id: String,
    category_id: String,

    options: {
        embed: {
            title: String,
            color: String,
            description: String
        },
        emoji: String
    },

    _lastMessage: String
})

module.exports = mongoose.model('Panel', PanelSchema)