const mongoose = require('mongoose')

const ObjectId = mongoose.SchemaTypes.ObjectId

const TicketSchema = new mongoose.Schema({
    parent: String,
    channel: String,
    
    _message: String
})

module.exports = mongoose.model('Ticket', TicketSchema)