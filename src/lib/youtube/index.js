const fetch = require('node-fetch');

const API_KEY = process.env.API_KEY
const API_URL = 'https://youtube.googleapis.com'
const API_PLAYLISTS_URL = '/youtube/v3/playlists'

module.exports = {
    checkIfPlaylistExists
}

async function checkIfPlaylistExists(playListId) {
    let url = buildUrl(API_PLAYLISTS_URL)
    url.searchParams['maxResults'] =  '50'
    url.searchParams['mine'] = 'true'
    do {
        let resp = await call(url)
        console.log(resp)
        if (resp.items.has(item => item.id === playListId) > 0) {
            return true
        }
        url.searchParams.pageToken = resp.nextPageToken
    } while (url.searchParams.pageToken)
    return false
}



function insertOne() {}

function buildUrl(section) {
    return new URL(`${API_URL}${section}?key=${API_KEY}`)
}

async function call(url) {
    const response = await fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        // FIXME credentials: 'include', // include, *same-origin, omit
        headers: {
            // FIXME Authorization: 'Bearer [YOUR_ACCESS_TOKEN]',
            Accept: 'application/json'

        }
    })
    return response.json();
}
