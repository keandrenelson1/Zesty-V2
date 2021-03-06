const Command = require("../Command.js");
const { MessageEmbed } = require("discord.js");
const gis = require("g-i-s");
const Filter = require("bad-words");
const customFilter = new Filter({ placeHolder: "*" });

module.exports = class ImagesCommand extends Command {
  constructor(client) {
    super(client, {
      name: "images",
      usage: "images <search>",
      description: "Find an image in Google.",
      type: client.types.FUN,
    });
  }
  async run(message, args) {
    const msg = await message.channel.send({ content: "Searching..." });

    let search = args.join(" ");
    if (!search) {
      return message.channel.send("Insert the you want to search first");
    }

    search = customFilter.clean(search);

    var options = {
      searchTerm: search,
      queryStringAddition: "&safe=active",
      filterOutDomains: [
        "google.com",
        "youtube.com",
        "giphy.com",
        "imgur.com",
        "twitter.com",
        "facebook.com",
        "instagram.com",
        "pixabay.com",
        "pinterest.com",
        "deviantart.com",
      ],
    };

    gis(options, logResults);

    function logResults(error, results) {
      if (error) {
        return this.sendErrorMessage(
          message,
          1,
          "Please try again in a few seconds"
        );
      } else {
        var i = 0;

        let max = results.length - 1;

        const embed = new MessageEmbed()
          .setTitle("Result to your search")
          .setImage(results[i].url)
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor)
          .setFooter({
            text: `Page : ` + parseInt(i + 1) + `/` + parseInt(max + 1),
          });
        msg.edit({ embeds: [embed] }).then((msg) => {
          msg.react("◀️");
          msg.react("⏹️");
          msg.react("▶️");
          msg.awaitReactions((reaction, user) => {
            if (message.author.id !== user.id) {
              return;
            }
            if (reaction.emoji.name === "▶️") {
              if (i !== max) {
                i++;
                const embeds = new MessageEmbed()
                  .setTitle("Result to your search")
                  .setImage(results[i].url)
                  .setTimestamp()
                  .setColor(message.guild.me.displayHexColor)
                  .setFooter({
                    text: "Page : " + parseInt(i + 1) + "/" + parseInt(max + 1),
                  });
                msg.edit({ embeds: [embeds] });
              }
            }
            if (reaction.emoji.name === "⏹️") {
              msg.reactions.cache.get("◀️").remove();
              msg.reactions.cache.get("⏹️").remove();
              msg.reactions.cache.get("▶️").remove();
              const embedsss = new MessageEmbed()
                .setAuthor({
                  name: "Google Images",
                  iconURL:
                    "https://assets.stickpng.com/thumbs/5847f9cbcef1014c0b5e48c8.png",
                })
                .setDescription("Thanks for using Google Images")
                .setColor(message.guild.me.displayHexColor)
                .setTimestamp();
              msg.edit({ embeds: [embedsss] });
            }
            if (reaction.emoji.name === "◀️") {
              if (1 !== i) {
                i--;
                const embedss = new MessageEmbed()
                  .setTitle("Result to your search")
                  .setImage(results[i].url)
                  .setTimestamp()
                  .setColor(message.guild.me.displayHexColor)
                  .setFooter({
                    text: "Page : " + parseInt(i + 1) + "/" + parseInt(max + 1),
                  });
                msg.edit({ embeds: [embedss] });
              }
            }
          });
        });
      }
    }
  }
};
