const mongoose = require('mongoose');
const CustomPrefix = require('../models/customprefix');

module.exports = async (client, guild) => {
    guild = new CustomPrefix({
        _id: mongoose.Types.ObjectId(),
        guildID: guild.id,
        guildName: guild.name,
        prefix: process.env.PREFIX
    });

    guild.save()
    .then(result => console.log(result))
    .catch(err => console.error(err));

    console.log('I have joined a new server!');
};