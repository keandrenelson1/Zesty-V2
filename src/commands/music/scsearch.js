const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class ScsearchMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'scsearch',
      usage: 'scsearch <query>',
      description: 'Searches Soundcloud for a provided query',
	  examples: ['scsearch Pumped Up Kicks'],
      type: client.types.MUSIC,
      disabled: true
    });
  }
  async run(message) {
    }
  };
