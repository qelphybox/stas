const youtube = require('./index')

test("test", async () => {
    console.log(
        await youtube.checkIfPlaylistExists("PLU07HAmXSEyc7ROmO4pVsnVcr5_rfjHQP")
    )
})
