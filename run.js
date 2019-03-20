const CHAMPIA_TOKEN = require("./token.js")

const Discord = require("discord.js")
const client = new Discord.Client()

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`)
})

client.on("message", (message) => {
    if (message.content.startsWith("!ping")) {
        message.reply("pong !")
    }
})

client.login(CHAMPIA_TOKEN)
