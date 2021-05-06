const gapi = require('./gapi')
const youtube = require('./youtube')

test('check ', async () => {
  const response = await youtube
    .follow('_', 'https://www.youtube.com/playlist?list=PLU07HAmXSEyc7ROmO4pVsnVcr5_rfjHQP')
    .catch((err) => {
      if (err instanceof gapi.Unauthorized) {
        console.error(`Auth URL = ${err.authUrl}`)
      } else {
        throw err
      }
    })

  console.log(response)
})
