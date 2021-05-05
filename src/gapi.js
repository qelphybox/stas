const fs = require('fs');

const { google } = require('googleapis');

// FIXME: make methods async (heavy ones)
const FILE_STORAGE = {
    readTokens() {
        if (!fs.existsSync('__credentials.json'))
            return false

        const content = fs.readFileSync('__credentials.json', 'utf8')
        return JSON.parse(content)
    },
    updateTokens(tokens) {
        fs.writeFileSync('__credentials.json', JSON.stringify(tokens))
    },
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
            FILE_STORAGE.updateTokens(tokens)
        });

        this.oAuth2Client.setCredentials(
            FILE_STORAGE.readTokens()
        )

    }

    async needsAuthCode() {
        const hasTokens = FILE_STORAGE.readTokens() !== false
        if (hasTokens)
            return null

        return this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent', // FIXME: here for testing purposes
            scope: SCOPES.join(','),
        })
    }

    async submitAuthCode(code) {
        const { tokens } = await this.oAuth2Client.getToken(code)
        this.oAuth2Client.setCredentials(tokens)
        FILE_STORAGE.updateTokens(tokens)
    }

}

const gapi = new Gapi()

google.options({
    auth: gapi.oAuth2Client
})

module.exports = gapi
