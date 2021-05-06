const { client } = require('./db')

const { google } = require('googleapis')

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
    const hasTokens = (await readTokens()) !== false
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

  async _internal_dropToken() {
    await client.query(UPSERT_EXEC, [''])
  }
}

// persists

const FIND_ONE_QUERY = `
    select value
    from stas_dict
    where key = 'token'
`

const UPSERT_EXEC = `
    insert into stas_dict(key, value)
    values('token', $1::text)
    on conflict (key) do update set value = $1::text
`

async function readTokens() {
  const tokenResponse = await client.query(FIND_ONE_QUERY)
  if (tokenResponse.rows.length === 1 && tokenResponse.rows[0].value) {
    return JSON.parse(tokenResponse.rows[0].value)
  } else {
    return false
  }
}

async function updateTokens(tokens) {
  if (!tokens.refresh_token) {
    const current = await readTokens()
    if (current.refresh_token) {
      tokens.refresh_token = current.refresh_token
    }
  }
  await client.query(UPSERT_EXEC, [JSON.stringify(tokens)])
  return tokens
}

// exports

const gapi = new Gapi()

google.options({
  auth: gapi.oAuth2Client,
})

module.exports = gapi
