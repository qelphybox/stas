const gapi = require('./gapi')
const { google } = require('googleapis')

const EXTRACT_PLAYLIST_ID_PATTERN = /^https?:\/\/www.youtube.com\/playlist\?.*list=([^&]+)/

const youtube = google.youtube({
  version: 'v3',
})

class YoutubeManager {
  async follow(chatId, playlistUrl) {
    const playlistId = extractPlaylistId(playlistUrl)
    if (!playlistId) {
      throw Error(`No Playlist ID extracted from URL: ${playlistUrl}`)
    }

    await gapi.needsAuthCode().then((authUrl) => {
      if (authUrl) {
        throw new gapi.Unauthorized(authUrl)
      }
    })

    const response = await youtube.playlists.list({
      part: ['id', 'snippet'],
      id: playlistId,
    })

    if (response.data.items.length === 1) {
      console.log(response.data.items[0])
      return 'GREAT SUCCESS!'
    } else {
      return Error(`PLAYLIST NOT FOUND: ${playlistId}`)
    }
  }
}

function extractPlaylistId(playlistUrl) {
  const matching = EXTRACT_PLAYLIST_ID_PATTERN.exec(playlistUrl)
  return matching && matching[1]
}

const youtubeManager = new YoutubeManager()
module.exports = youtubeManager
