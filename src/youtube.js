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

        const playlistId = extractPlaylistId(playlistUrl)
        if (!playlistId) {
            return new this.Answer.Error(`No Playlist ID extracted from URL: ${playlistUrl}`)
        }

        await gapi.needsAuthCode()
            .then(authUrl => {
                if (authUrl) {
                    return new this.Answer.Unauthorized(authUrl)
                }
            })
            .catch(err => {
                console.error(err)
                return new this.Answer.Error(err)
            })

        await youtube.playlists.list({
            part: ['id', 'snippet'],
            id: playlistId
        })
            .then(response => {
                if (response.data.items.length === 1) {
                    console.log(response.data.items[0])
                    return new this.Answer.OK('GREAT SUCCESS!')
                } else {
                    return new this.Answer.OK('PLAYLIST NOT FOUND: ' + playlistId) // FIXME: NOT OK
                }
            })
            .catch(err => {
                console.error(err)
                return new this.Answer.Error(err)
            })

    }

    // async append(chatId, videoUrl) {
    //
    //     await gapi.needsAuthCode()
    //         .then(authUrl => {
    //             if (authUrl) {
    //                 return new this.Answer.Unauthorized(authUrl)
    //             }
    //         })
    //         .catch(err => {
    //             console.error(err)
    //             return new this.Answer.Error(err)
    //         })
    //
    //     await youtube.playlistItems.list({
    //         part: ['id', 'snippet'],
    //         playlistId: playlistId
    //     })
    //         .then(response => {
    //             if (response.data.items.length === 1) {
    //                 console.log(response.data.items[0])
    //                 return new this.Answer.OK('GREAT SUCCESS!')
    //             } else {
    //                 return new this.Answer.OK('PLAYLIST NOT FOUND: ' + playlistId) // FIXME: NOT OK
    //             }
    //         })
    //         .catch(err => {
    //             console.error(err)
    //             return new this.Answer.Error(err)
    //         })
    //
    // }

}

function extractPlaylistId(playlistUrl) {
    const matching = EXTRACT_PLAYLIST_ID_PATTERN.exec(playlistUrl)
    return matching && matching[1]
}

const youtubeManager = new YoutubeManager()
module.exports = youtubeManager
