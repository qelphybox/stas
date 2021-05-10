const boot = require('./boot')
const callbackServer = require('./callbackServer')

boot({
  onBoot: async () => {
    await callbackServer.start().catch((error) => {
      console.error('Callback server init failed:')
      throw error
    })
  },
  onShutdown: async () => {
    await callbackServer.stop()
  },
})
