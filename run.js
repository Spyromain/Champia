const CHAMPIA_TOKEN = require("./token.js")

const FIANO_ID = "307984283774222348"

const Discord = require("discord.js")
const client = new Discord.Client()

function removeDiacritics(string) {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`)
})

client.on("message", (message) => {
    if (message.content.startsWith("!ping")) {
        message.reply("pong !")
    }

    if (message.author.id === FIANO_ID && removeDiacritics(message.content).toUpperCase().includes("OK")) {
        message.channel.send(`🌩️ Que la foudre s'abatte sur ${message.author} ! 🌩️`)
        .then((message) => {
            message.delete()
        })
    }
})

client.login(CHAMPIA_TOKEN)
