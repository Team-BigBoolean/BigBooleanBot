const Discord = require("discord.js");
const { Client, Intents } = require("discord.js");
const intents = new Intents();
intents.add(
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MEMBERS
);

const config = require("./config.json")

const https = require("https");

const client = new Client({ intents: intents });

client.on("messageCreate", (message) => {
  var contents = message.content.toLowerCase();
  if (contents.startsWith("!addme ")) {
    addUserCloudflare(contents.substring("!addme ".length));
    message.delete;
  }
  if (message.channel.id != 949071574810636288n) return;

  if (message.attachments.size > 0) {
    if (message.attachments.every(attachIsImage)) {
      message.attachments.forEach((attachment) => {
        const ImageLink = attachment.proxyURL;
        message.guild.setIcon(ImageLink);
        return;
      });
    }
  }
});

function attachIsImage(msgAttach) {
  var url = msgAttach.url;
  return url.indexOf("png", url.length - "png".length) !== -1;
}

async function addUserCloudflare(email) {
  var data = JSON.stringify({
    email: email,
    roles: ["05784afa30c1afe1440e79d9351c7430"],
  });

  const options = {
    hostname: "api.cloudflare.com",
    port: 443,
    path: `/client/v4/accounts/${config.AccountID}/members`,
    method: "POST",
    headers: {
      "Authorization": `Bearer ${config.CloudflareToken}`,
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);

    res.on("data", (d) => {
      process.stdout.write(d);
    });
  });

  req.on("error", (error) => {
    console.error(error);
  });

  req.write(data);
  req.end();
}

client.login(config.DiscordToken);
