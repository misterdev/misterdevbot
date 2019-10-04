const { Composer, log, session } = require('micro-bot')
const { CronJob } = require('cron')
require('dotenv').config()

const bot = new Composer()
const { DEV, LU, REMINDER } = process.env

bot.init = async (mBot) => {
  bot.telegram = mBot.telegram
  bot.telegram.sendMessage(DEV, `🚀 BOT RESTARTED 🚀\n[${new Date()}]\n\n`)
  new CronJob('00 45 20 * * *', function () {
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

const luRegExp = /\/LU/
bot.hears(luRegExp, (ctx) => {
  if (ctx.message.from.id == DEV) {
    const forward = ctx.message.text.replace(luRegExp, '')
    bot.telegram.sendMessage(LU, forward)
  }
})

const exitRegExp = /\/EXIT id:([\w-])* /
bot.hears(exitRegExp, (ctx) => {
  const { from, text } = ctx.message
  if (from.id == DEV) {
    const chatId = text.match(/id:([\w-])* /)[0].replace('id:', '')
    const message = text.replace(exitRegExp, '')
    bot.telegram.sendMessage(DEV, `Leaving ${chatId} saying ${message}`)
    bot.telegram.sendMessage(chatId, message)
    bot.telegram.leaveChat(chatId)
  }
})

const sendRegExp = /\/SEND id:([\w-])* /
bot.hears(sendRegExp, (ctx) => {
  const { from, text } = ctx.message
  console.log(from.id == DEV)
  if (from.id == DEV) {
    const chatId = text.match(/id:([\w-])* /)[0].replace('id:', '')
    const message = text.replace(sendRegExp, '')
    bot.telegram.sendMessage(DEV, `To ${chatId} I say: ${message}`)
    bot.telegram.sendMessage(chatId, message)
  }
})

bot.on('message', (ctx) => {
  const { from, chat, text } = ctx.message
  const { new_chat_member, left_chat_member } = ctx.message
  let log = `${text}\nfrom (${chat.type}): "${from.first_name}" (@${from.username}, #${from.id})\n`
  if (chat.type != 'private') {
    log += `chat: "t.me/${chat.title}" (#${chat.id})\n`
  }
  if (new_chat_member) {
    log += `new chat member: "${new_chat_member.first_name}" (@${new_chat_member.username}, #${new_chat_member.id})\n`
  }
  if (left_chat_member) {
    log += `left chat member: "${left_chat_member.first_name}" (@${left_chat_member.username}, #${left_chat_member.id})\n`
  }
  bot.telegram.sendMessage(DEV, log)
})

module.exports = bot
