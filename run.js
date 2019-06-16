const { exec } = require("child_process")

const CHAMPIA_TOKEN = require("./token.js")

const FIANO_ID = "307984283774222348"

const CHANNEL_CONFIG_BOT_ID = "332608636159524887"

const Discord = require("discord.js")
const client = new Discord.Client()

const Tesseract = require("tesseract.js")
const worker = new Tesseract.TesseractWorker()

const removeDiacritics = (string) =>
    string.normalize('NFD').replace(/[\u0300-\u036f]/g, "")

const antiFiano = (message) =>
    message.author.id === FIANO_ID
    ? removeDiacritics(message.content.replace(/\s/g, "")).toUpperCase().includes("OK")
        ? message.channel.send(`🌩️ Que la foudre s'abatte sur ${message.author} ! 🌩️`)
        .then(() =>
            message.delete()
        )
        : message.attachments
        .filter((attachment) => attachment.width != null)
        .map((attachment) => attachment.url)
        .concat(
            message.embeds
            .filter((embed) => embed.thumbnail != null)
            .map((embed) => embed.thumbnail.url)
        )
        .reduce((accumulator, value) =>
            accumulator
            .then((ok) =>
                ok
                ? Promise.resolve(true)
                : new Promise((resolve, reject) =>
                    worker
                    .recognize(value)
                    .then((result) =>
                        client.channels
                        .get(CHANNEL_CONFIG_BOT_ID)
                        .send("[Tesseract] " + result.text)
                        .then(() =>
                            resolve(removeDiacritics(result.text).toUpperCase().includes("OK"))
                        )
                    )
                )
            )
        , Promise.resolve(false))
        .then((ok) =>
            ok
            ? message.channel
            .send(`🌩️🌩️🌩️ Que la foudre s'abatte **violemment** sur ${message.author} !!! 🌩️🌩️🌩️`)
            .then(() =>
                message.delete()
            )
            : Promise.resolve()
        )
        : Promise.resolve()

client.on("ready", () =>
    console.log(`Logged in as ${client.user.tag}`)
)

client.on("message", (message) =>
    message.content.startsWith("!ping")
        ? message.reply("pong !")
        : message.content.startsWith("!start-server")
            ? new Promise((resolve) =>
                exec("../start_public.sh", (error, stdout, stderr) =>
                    resolve(stdout)
                )
            )
            .then((stdout) =>
                message.channel.send(stdout || "Une erreur est survenue")
            )
            : Promise.resolve()
    .then(() =>
        antiFiano(message)
    )
)

client.on("messageUpdate", (message) =>
    message.author.id === FIANO_ID
    ? antiFiano(message)
    : Promise.resolve()
)

client.login(CHAMPIA_TOKEN)
