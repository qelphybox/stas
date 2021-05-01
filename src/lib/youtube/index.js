const { google } = require('googleapis');

/**
 * Create a new OAuth2 client with the configured keys.
 */
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CLIENT_REDIRECT_URL
);

const tmp_storage = {
    refresh_token: '4/0AY0e-g7QG1-l86LW3LL9tbnon4i3IG5mnmpfj9VZiZuDeAz4UQo-km17Qeum8ljQ-A_B5g',
    access_token: 'ya29.a0AfH6SMBQfkPpAjaaXO-KC6RCSsgRBSWNIA3buxa9Asj9XhT08TGS6dCm_Mhti3pe5FSYOWm51LZi7CTKqlev5nCSFxP8grfsFE9T-ANMg3GZJDfCrVFD_YKGs1h0VwpcHDbFCXzQEEODNpKWNKcW4kEL0P24'
}

oauth2Client.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
        // store the refresh_token in my database!
        tmp_storage.refresh_token = tokens.refresh_token
    }
    console.log('========== TOKENS ==============')
    console.log(tokens)
    console.log(tokens.refresh_token)
    console.log('')
});

async function ensureValidToken() {
    if (tmp_storage.refresh_token) {
        const {tokens} = await oauth2Client.getToken(tmp_storage.refresh_token)
        console.log('========== REFRESH ==============')
        console.log(tokens)
        console.log(tokens.refresh_token)
        console.log('')
        oauth2Client.setCredentials(tokens)
        return true
    } else {
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/youtube',
        })
        console.error(`Unauthorized: Auth URL => ${authUrl}`)
        return false
    }
}

/**
 * This is one of the many ways you can configure googleapis to use authentication credentials.  In this method, we're setting a global reference for all APIs.  Any other API you use here, like google.drive('v3'), will now use this auth client. You can also override the auth client at the service and method call levels.
 */
google.options({
    auth: oauth2Client
})

const youtube = google.youtube({
    version: 'v3'
})

module.exports = {
    checkIfPlaylistExists
}

async function checkIfPlaylistExists(playListId) {

    if (!await ensureValidToken()) return

    // const authClient = await youtube.auth.getClient();
    youtube.playlists.list({
        part: ['id'],
        maxResults: 50,
        mine: true
    },{

    }, (err, res) => {
        if (err) {
            console.log('Error=' + err)
        }
        console.log(res)
    })
}
