const gapi = require('./gapi');
const { google } = require('googleapis');

const EXTRACT_PLAYLIST_ID_PATTERN = /^https?:\/\/www.youtube.com\/playlist\?.*list=([^&]+)/

const youtube = google.youtube({
    version: 'v3'
})

class YoutubeManager {

    Answer = class {
        static OK = class { data; constructor(data) { this.data = data } }
        static Unauthorized = class { authUrl; constructor(authUrl) { this.authUrl = authUrl } }
        static Error = class { reason; constructor(reason) { this.reason = reason } }
    }

    async follow(chatId, playlistUrl) {
        const playlistId = YoutubeManager.#extractPlaylistId(playlistUrl)
        if (!playlistId) {
            return new this.Answer.Error(`No Playlist ID extracted from URL: ${playlistUrl}`)
        }


        const authUrl = await gapi.needsAuthCode()
            .catch(err => {
                return new this.Answer.Error(err)
            })

        if (authUrl) {
            return new this.Answer.Unauthorized(authUrl)
        }

        const response = await youtube.playlists.list({
            part: ['id'],
            id: playlistId
        })

        if (response.data.items.length === 1) {
            return new this.Answer.OK('GREAT SUCCESS!')
        } else {
            return new this.Answer.OK('PLAYLIST NOT FOUND: ' + playlistId)
        }

    }

    static #extractPlaylistId(playlistUrl) {
        const matching = EXTRACT_PLAYLIST_ID_PATTERN.exec(playlistUrl)
        return matching && matching[1]
    }

}

const youtubeManager = new YoutubeManager()
module.exports = youtubeManager
