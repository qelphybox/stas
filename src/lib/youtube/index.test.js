const youtube = require('./index')

test("test", () => {
    console.log(
        youtube.checkIfPlaylistExists("PLU07HAmXSEyc7ROmO4pVsnVcr5_rfjHQP")
    )
})
