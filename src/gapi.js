const { google } = require('googleapis')

const { readDictValue, updateDictValue } = require('./repository')

const SCOPES = ['https://www.googleapis.com/auth/youtube']

class Gapi {
  Unauthorized = class {
    authUrl
    constructor(authUrl) {
      this.authUrl = authUrl
    }
  }

  oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CLIENT_REDIRECT_URL
  )

  constructor() {
    this.oAuth2Client.on('tokens', (tokens) => updateTokens(tokens))

    readTokens().then((tokens) => this.oAuth2Client.setCredentials(tokens))
  }

  async needsAuthCode() {
    const hasTokens = await readTokens()
    if (hasTokens) return null

    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent', // FIXME: here for testing purposes
      scope: SCOPES.join(','),
    })
  }

  async submitAuthCode(code) {
    const { tokens } = await this.oAuth2Client.getToken(code)
    const fullTokens = await updateTokens(tokens)
    this.oAuth2Client.setCredentials(fullTokens)
  }
}

// persists

const DICT_KEY = 'gapi_token'

async function readTokens() {
  return JSON.parse(await readDictValue(DICT_KEY))
}

async function updateTokens(tokens) {
  if (!tokens.refresh_token) {
    const current = await readTokens()
    if (current.refresh_token) {
      tokens.refresh_token = current.refresh_token
    }
  }
  await updateDictValue(DICT_KEY, JSON.stringify(tokens))
  return tokens
}

// exports

const gapi = new Gapi()

google.options({
  auth: gapi.oAuth2Client,
})

module.exports = gapi
