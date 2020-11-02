const fetch = require("node-fetch")
const { MessageEmbed } = require('discord.js');
const settings = require('../settings.json');
exports.run = async (c, m, a) => {
	if (a.length >= 2) {
		let platform = a[0].lower();
		if (platform === 'xbox') platform = 'xbl';
		if (platform === 'ps4') platform = 'psn';
		if (!(a[0] == "pc" || a[0] == "psn" || a[0] == "xbl")) {
			return m.reply({
				embed: new MessageEmbed()
					.setAuthor("400: Invalid platform.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
					.setColor("#ff3860")
					.setFooter('Valid platforms are `pc`,`xbl` and `psn`')
			});
		}
		var e = await m.reply({
			embed: new MessageEmbed()
				.setTitle("Working...")
				.setDescription(`Please wait a few seconds`)
				.setColor("#ffdd57")
		});

		var r = await fetch(`https://api.fortnitetracker.com/v1/profile/${platform}/${a[1]}`, {
			headers: {
				"TRN-Api-Key": settings.trn_api_key
			}
		})
		var j = await r.json()
		if (j.error) {
			var text = j.error
			if (text == "Player Not Found") {
				return e.edit({
					embed: new MessageEmbed()
						.setAuthor("404: Account not found.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
						.setColor("#ff3860")
