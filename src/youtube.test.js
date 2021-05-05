const youtube = require('./youtube')

test('check ', async () => {
    console.log(
        await youtube.follow('_', 'https://www.youtube.com/playlist?list=PLU07HAmXSEyc7ROmO4pVsnVcr5_rfjHQP')
    )
})
