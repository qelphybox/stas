const youtube = require('./youtube')

test('check ', async () => {
    const answer = await youtube.follow('_', 'https://www.youtube.com/playlist?list=PLU07HAmXSEyc7ROmO4pVsnVcr5_rfjHQP')
    switch (true) {
        case answer instanceof youtube.Answer.OK:
            console.log(`ok: ${answer.data}`)
            break
        case answer instanceof youtube.Answer.Unauthorized:
            console.log(`still ok: ${answer.authUrl}`)
            break
        case answer instanceof youtube.Answer.Error:
            console.error(`ok: ${answer.reason}`)
            break
        default:
            throw 'O_o'
    }
})
