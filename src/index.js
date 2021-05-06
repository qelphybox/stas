require('dotenv').config()
const db = require('./db')
const bot = require('./bot')

const youtube = require('./youtube')
const callbackServer = require('./callbackServer')

db.connect()
  .then(() => {
    console.log('Connected to postgres')
    callbackServer.start().catch((error) => {
      console.error('Callback server init failed:')
      throw error
    })
    bot.startPolling().catch((error) => {
      console.error('Can not start polling')
      throw error
    })
  })
  .catch((error) => {
    console.error('Unable to connect to the database:')
    throw error
  })

process.on('exit', async (code) => {
  console.log(`Exit with code ${code}, stopping...`)
  await bot.stopPolling()
  await callbackServer.stop()
  await db.disconnect()
  console.log('Bye!')
})
