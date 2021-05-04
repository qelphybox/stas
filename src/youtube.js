const gapi = require('./gapi');
const { google } = require('googleapis');

module.exports = {
    listPlaylists
}

const youtube = google.youtube({
    version: 'v3'
})

async function listPlaylists(playListId) {

    const authUrlIfNeeded = gapi.needsAuthCode()
    if (authUrlIfNeeded) {
        console.log(authUrlIfNeeded)
        return
    }

    const response = await youtube.playlists.list({
        part: ['id'],
        maxResults: 50,
        mine: true
    })

    console.log(response)

}
