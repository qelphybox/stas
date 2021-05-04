const { google } = require('googleapis');

const IN_MEMORY_STORAGE = {
    _tokens: null,
    hasTokens() { return IN_MEMORY_STORAGE._tokens != null },
    setTokens(tokens) { IN_MEMORY_STORAGE._tokens = tokens },
}

const SCOPES = [
    'https://www.googleapis.com/auth/youtube'
]

class Gapi {

    oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CLIENT_REDIRECT_URL
    );

    constructor() {
        this.oAuth2Client.on('tokens', (tokens) => {
            console.log('ON tokens:')
            console.log(tokens)
            IN_MEMORY_STORAGE.setTokens(tokens)
        });
    }

    needsAuthCode() {
        if (IN_MEMORY_STORAGE.hasTokens())
            return null

        return this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES.join(','),
        })
    }

    async submitAuthCode(code) {
        const { tokens } = await this.oAuth2Client.getToken(code)
        console.log('NEW tokens:')
        console.log(tokens)
        this.oAuth2Client.setCredentials(tokens)
        IN_MEMORY_STORAGE.setTokens(tokens)
    }

}

const gapi = new Gapi()

google.options({
    auth: gapi.oAuth2Client
})

module.exports = gapi
