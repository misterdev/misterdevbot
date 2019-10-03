const { Composer, log, session } = require('micro-bot')
const { CronJob } = require('cron')

const bot = new Composer()

const { DEV, LU, REMINDER } = process.env

bot.init = async (mBot) => {
    bot.telegram = mBot.telegram
    bot.telegram.sendMessage(DEV, `🚀 BOT RESTARTED 🚀\n[${new Date()}]\n\n`)
    new CronJob('00 45 20 * * *', function() {
        bot.telegram.sendMessage(DEV, REMINDER)
        bot.telegram.sendMessage(LU, REMINDER)
    }, null, true, 'Europe/Rome')
}

bot.use(log())
bot.use(session())

bot.start(({ reply }) => reply('🐕'))
bot.help(({ reply }) => reply('🐕'))
bot.settings(({ reply }) => reply('🐕'))

bot.hears('erik', (ctx) => ctx.reply('culo'))
bot.hears('culo', (ctx) => ctx.reply('erik'))
bot.hears(/\/LU/, (ctx) => {
    if (ctx.message.from.id == DEV) {
        const forward = ctx.message.text.replace(/\/LU/, "")
        bot.telegram.sendMessage(LU, forward)
    }
})

module.exports = bot
