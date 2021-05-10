require('dotenv').config()
const db = require('./db')

module.exports = async ({ onBoot, onShutdown }) => {
  try {
    await db.connect()
  } catch (err) {
    console.error('Unable to connect to the database:')
    throw err
  }
  console.log('Connected to postgres')
  if (onBoot) await onBoot()

  process.on('exit', async (code) => {
    console.log(`Exit with code ${code}, stopping...`)
    if (onShutdown) await onShutdown()
    await db.disconnect()
    console.log('Bye!')
  })
}
