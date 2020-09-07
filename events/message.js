const mongoose = require('mongoose');
const CustomPrefix = require('../models/customprefix');
const Discord = require('discord.js');
const { MessageEmbed } = require("discord.js");

// Catching Uncaught Promise Rejection
process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

const cooldowns = new Discord.Collection();

// Mention Prefix
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = async (client, message) => {

    if (message.author.bot) return; // ignoring bots
    if (message.channel.type === 'dm') return; // ignoring DM messages

    // custom prefix mongo stuff

    const prefixSettings = await CustomPrefix.findOne({
        guildID: message.guild.id,
    }, (err, guild) => {
        if (err) console.error(err);
        if (!guild) {
            const newGuild = new CustomPrefix({
                _id: mongoose.Types.ObjectId(),
                guildID: message.guild.id,
                guildName: message.guild.name,
                prefix: process.env.PREFIX,
            });

            newGuild.save()
            .then(result => console.log(result))
            .catch(err => console.error(err));

            const newDataEmbed = new MessageEmbed()
            .setTitle("New Server!")
            .setTimestamp()
	     .setFooter('Developed By Rayne')
            .setDescription('Thank you for inviting me to your server 💌! This server is now registered in my database. You should be able to use my commands now.')
            .setAuthor(message.guild.me.displayName, client.user.displayAvatarURL());

            return message.channel.send(newDataEmbed);
        }
    });

    const prefix = prefixSettings.prefix;
    
    // message event stuff

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
	if (!prefixRegex.test(message.content)) return;

	const [, matchedPrefix] = message.content.match(prefixRegex);

    if (!message.content.startsWith(matchedPrefix)) return;
    
    if (!message.member) message.member = await message.guild.fetchMember (message);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    let command = client.commands.get(cmd);

    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (!command) return message.reply(`${emojis.no} I don't recognise that, try using \`${prefix}help\` for help.`).then(message.react('747324171477843979'));

    if (command.args && !args.length) {
        let reply = `${emojis.no} You didn't provide any arguments, ${message.author}!`;
    
    	if (command.usage) {
    		reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    	}
    
        return message.channel.send(reply);
    }

    if (command.permissions && (!message.member.hasPermission(command.permissions))) {
        return message.reply(`${emojis.no} You don not have the following permissions-\n ${command.permissions}`);
    }


    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	    if (now < expirationTime) {
		    const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`).then(message.react('⏰'));
	    }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    if (command) {
        command.run(client, message, args, prefix);
    }
};
