const gapi = require('./gapi');
const { google } = require('googleapis');

const EXTRACT_PLAYLIST_ID_PATTERN = /^https?:\/\/www.youtube.com\/playlist\?.*list=([^&]+)/

const youtube = google.youtube({
    version: 'v3'
})



class YoutubeManager {

    static Answer = class {
        static OK = class { constructor(data) { this.data = data } }
        static Unauthorized = class { constructor(authUrl) { this.authUrl = authUrl } }
        static Error = class { constructor(reason) { this.reason = reason } }
    }

    async follow(chatId, playlistUrl) {
        const playlistId = YoutubeManager.#extractPlaylistId(playlistUrl)
        if (!playlistId) {
            return new YoutubeManager.Answer.Error(`No Playlist ID extracted from URL: ${playlistUrl}`)
        }


        const authUrl = await gapi.needsAuthCode()
            .catch(err => {
                return new YoutubeManager.Answer.Error(err)
            })

        if (authUrl) {
            return new YoutubeManager.Answer.Unauthorized(authUrl)
        }

        const response = await youtube.playlists.list({
            part: ['id'],
            id: playlistId
        })

        if (response.data.items.length === 1) {
            return new YoutubeManager.Answer.OK('GREAT SUCCESS!')
        } else {
            return new YoutubeManager.Answer.OK('PLAYLIST NOT FOUND: ' + playlistId)
        }

    }

    static #extractPlaylistId(playlistUrl) {
        const matching = EXTRACT_PLAYLIST_ID_PATTERN.exec(playlistUrl)
        return matching && matching[1]
    }

}

const youtubeManager = new YoutubeManager()
module.exports = youtubeManager
