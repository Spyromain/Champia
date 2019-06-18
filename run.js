const { exec } = require("child_process")

const CHAMPIA_TOKEN = require("./token.js")

const FIANO_ID = "307984283774222348"

const CHANNEL_FIANOWORLD_ID = "344799840422854657"
const CHANNEL_CONFIG_BOT_ID = "332608636159524887"

const Discord = require("discord.js")
const client = new Discord.Client()

const Tesseract = require("tesseract.js")
const worker = new Tesseract.TesseractWorker()

const removeDiacritics = (string) => {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
}

const antiFiano = async (message) => {
    if (message.author.id === FIANO_ID && message.channel.id !== CHANNEL_FIANOWORLD_ID) {
        if (removeDiacritics(message.content.replace(/\s/g, "")).toUpperCase().includes("OK")) {
            await message.channel.send(`🌩️ Que la foudre s'abatte sur ${message.author} ! 🌩️`)
            await message.delete()
        }
        else {
            ok = await message.attachments
            .filter((attachment) => attachment.width != null)
            .map((attachment) => attachment.url)
            .concat(
                message.embeds
                .filter((embed) => embed.thumbnail != null)
                .map((embed) => embed.thumbnail.url)
            )
            .reduce(async (accumulator, value) => {
                if (await accumulator) {
                    return true
                }
                else {
                    return await new Promise((resolve, reject) =>
                        worker
                        .recognize(value)
                        .then((result) => {
                            client.channels
                            .get(CHANNEL_CONFIG_BOT_ID)
                            .send("[Tesseract] " + result.text)

                            resolve(removeDiacritics(result.text).toUpperCase().includes("OK"))
                        })
                    )
                }
            }, Promise.resolve(false))

            if (ok) {
                await message.channel
                .send(`🌩️🌩️🌩️ Que la foudre s'abatte **violemment** sur ${message.author} !!! 🌩️🌩️🌩️`)

                await message.delete()
            }
        }
    }
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`)
})

client.on("message", async (message) => {
    if (message.content.startsWith("!ping")) {
        await message.reply("pong !")
    }
    else if (message.content.startsWith("!start-server")) {
        output = await new Promise((resolve) => {
            exec("../start_public.sh", (error, stdout, stderr) =>
                resolve(stdout)
            )
        })
        await message.channel.send(output || "Une erreur est survenue")
    }
    await antiFiano(message)
})

client.on("messageUpdate", async (message) => {
    await antiFiano(message)
})

client.login(CHAMPIA_TOKEN)
