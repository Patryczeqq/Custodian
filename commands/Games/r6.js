const Command = require('../../base/Command.js');
const { RichEmbed } = require('discord.js');
const RainbowSixApi = require('rainbowsix-api-node');
const moment = require('moment');
const { inspect } = require('util');

class r6 extends Command {
  constructor(client) {
    super(client, {
      name: 'r6',
      description: 'Get stats about a Rainbow Six: Siege player.',
      category: 'Games',
      usage: 'r6 <username> <platform>',
      botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const platforms = ['uplay'];
    const R6 = new RainbowSixApi();
    const platform = args[0];
    if (!platforms.includes(platform)) return message.channel.send('Platform must be `uplay` currently.');
    const username = args.splice(1).join(' ');
    const msg = await message.channel.send(`Fetching the stats of ${username}.`);
    R6.stats(username, platform).then(response => {
      const stats = inspect(response, {depth:7});
      console.log(stats);
      const rankedPlaytime = moment(response.player.stats.ranked.playtime).format('h:mm:ss');
      const casualPlaytime = moment(response.player.stats.casual.playtime).format('h:mm:ss');
      const playtime = response.player.stats.ranked.playtime + response.player.stats.casual.playtime;
      const overallPlaytime = moment(playtime).format('h:mm:ss');
      const embed = new RichEmbed()
        .setAuthor(`${response.player.username}'s stats`, message.author.displayAvatarURL)
        .setColor('RANDOM')
        .addField('Ranked Wins', response.player.stats.ranked.wins, true)
        .addField('Ranked Losses', response.player.stats.ranked.losses, true)
        .addField('Ranked WLR', response.player.stats.ranked.wlr, true)
        .addField('Ranked Kills', response.player.stats.ranked.kills, true)
        .addField('Ranked Deaths', response.player.stats.ranked.deaths, true)
        .addField('Ranked KDR', response.player.stats.ranked.kd, true)
        .addField('Casual Wins', response.player.stats.casual.wins, true)
        .addField('Casual Losses', response.player.stats.casual.losses, true)
        .addField('Casual WLR', response.player.stats.casual.wlr, true)
        .addField('Casual Kills', response.player.stats.casual.kills, true)
        .addField('Casual Deaths', response.player.stats.casual.deaths, true)
        .addField('Casual KDR', response.player.stats.casual.kd, true)
        .addField('Total Revives', response.player.stats.overall.revives, true)
        .addField('Total Suicides', response.player.stats.overall.suicides, true)
        .addField('Total Bullets Fired', response.player.stats.overall.bullets_fired, true)
        .addField('Total Bullets Hit', response.player.stats.overall.bullets_hit, true)
        .addField('Total Headshots', response.player.stats.overall.headshots, true)
        .addField('Penetration Kills', response.player.stats.overall.penetration_kills, true)
        .addField('Total Ranked Playtime', rankedPlaytime, true)
        .addField('Total Casual Playtime', casualPlaytime, true)
        .addField('Total Playtime', overallPlaytime, true);
      msg.delete();
      message.channel.send({ embed });
    }).catch(error => {
      console.log(error);
      msg.edit('Something went wrong. Please try again later.');
    });
  }
}

module.exports = r6;