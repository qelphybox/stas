const boot = require('./boot')
const bot = require('./bot')

boot({
  onBoot: async () => {
    await bot.startPolling().catch((error) => {
      console.error('Can not start polling')
      throw error
    })
  },
  onShutdown: async () => {
    await bot.stopPolling()
  },
})
