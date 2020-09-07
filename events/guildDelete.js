const mongoose = require('mongoose');
const CustomPrefix = require('../models/customprefix');

module.exports = async (client, guild) => {
    CustomPrefix.findOneAndDelete({
        guildID: guild.id
    }, (err, res) => {
        if(err) console.error(err)
        console.log('I have been removed from a server!');
    });
};