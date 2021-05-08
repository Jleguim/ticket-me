const mongoose = require('mongoose')

const ObjectId = mongoose.SchemaTypes.ObjectId

const PanelSchema = new mongoose.Schema({
    channel: String,
    category: String,
    roles: [String],

    options: {
        pEmbed: {
            title: String,
            color: String,
            message: String
        },
        tEmbed: {
            title: String,
            color: String,
            message: String
        },
        emoji: String
    },

    _message: String
})

module.exports = mongoose.model('Panel', PanelSchema)