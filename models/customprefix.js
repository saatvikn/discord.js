const mongoose = require('mongoose');

const prefixSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    guildName: String,
    prefix: String,
});

module.exports = mongoose.model('Prefix', prefixSchema, 'prefixes');