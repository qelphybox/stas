const youtubeManager = require('./youtube_stub')
const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: {
    autoStart: false,
  },
})

bot.onText(/\/start/, async (msg) => {
  await bot.sendMessage(msg.chat.id, "Hello, im Stas 👋, use /follow to rock'n'roll 🤘")
})

bot.onText(/\/follow(.*)/, async (msg, match) => {
  const option = match[1]
  const url = typeof option === 'string' ? option.trim() : ''
  const chatId = msg.chat.id
  const respond = (text) => bot.sendMessage(chatId, text)

  if (url === '') {
    await respond('Please try "/follow https://youtube.com/playlist?list=PLlP9Z4Mnwk-9pZZD8BHQZVIxRAInY9R4c"')
    return
  }

  try {
    await youtubeManager.follow(chatId, url)
  } catch (err) {
    console.error(`Chat ${chatId} can not follow ${url}: ${err}`)
    await respond("😰 Sorry, there is unexpected error. I'm broken.")
  }

  await respond('Yeah! Try to /add links youtube')
})

bot.onText(/\/add.+(https:\/\/(www\.youtube\.com|youtu\.be)\/\S+)/, async (msg, match) => {
  const videoUrl = match[1]
  const chatId = msg.chat.id

  if (!(await youtubeManager.isFollowing(chatId))) {
    return
  }

  await youtubeManager.addToFollowing(chatId, videoUrl)
})

module.exports = bot
