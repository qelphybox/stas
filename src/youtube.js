const { google } = require('googleapis')

const gapi = require('./gapi')
const { readDictValue, updateDictValue } = require('./repository')

const EXTRACT_PLAYLIST_ID_PATTERN = /^https?:\/\/(www\.)?youtube\.com\/playlist\?.*list=([^&]+)/gi
const EXTRACT_VIDEO_ID_PATTERN = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi

const VIDEO_IN_PLAYLIST_SNIPPET_FN = (playlistId, videoId) => `{
  "kind": "youtube#playlistItem",
  "snippet": {
    "playlistId": "${playlistId}",
    "resourceId": {
      "videoId": "${videoId}",
      "kind": "youtube#video"
    }
  }
}`

const youtube = google.youtube({
  version: 'v3',
})

class YoutubeManager {
  async follow(chatId, playlistUrl) {
    const playlistId = extractPlaylistId(playlistUrl)
    if (!playlistId) {
      throw Error(`No Playlist ID can be extracted from URL: ${playlistUrl}`)
    }

    const authUrl = await gapi.needsAuthCode()
    if (authUrl !== null) {
      throw new gapi.Unauthorized(authUrl)
    }

    const response = await youtube.playlists.list({
      part: ['id', 'snippet'],
      id: playlistId,
    })

    if (response.data.items.length !== 1) {
      return Error(`Playlist not found: ${playlistId}`)
    }

    await assignChatIdToPlaylistId(chatId, playlistId)
  }

  async unfollow(chatId) {
    await assignChatIdToPlaylistId(chatId, null)
  }

  async append(chatId, videoUrl) {
    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      throw Error(`No Video ID can be extracted from URL: ${videoUrl}`)
    }

    const playlistId = await readPlaylistIdByChatId(chatId)
    if (!playlistId) {
      throw Error(`No playlist followed: chatId = ${chatId}`)
    }

    await youtube.playlistItems.insert(
      {
        part: ['snippet'],
      },
      { body: VIDEO_IN_PLAYLIST_SNIPPET_FN(playlistId, videoId) }
    )
  }
}

function extractPlaylistId(playlistUrl) {
  const matching = EXTRACT_PLAYLIST_ID_PATTERN.exec(playlistUrl)
  return matching && matching[1]
}

function extractVideoId(videoUrl) {
  const matching = EXTRACT_VIDEO_ID_PATTERN.exec(videoUrl)
  return matching && matching[1]
}

// persists

async function readPlaylistIdByChatId(chatId) {
  return await readDictValue(`follow_${chatId}`)
}

async function assignChatIdToPlaylistId(chatId, playlistId) {
  return await updateDictValue(`follow_${chatId}`, playlistId)
}

// exports

const youtubeManager = new YoutubeManager()
module.exports = youtubeManager
