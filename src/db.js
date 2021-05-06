const { Client } = require('pg')

class DB {
  client

  constructor(uri) {
    this.client = new Client({
      connectionString: uri,
    })
  }

  async connect() {
    return await this.client.connect()
  }

  async disconnect() {
    return await this.client.end()
  }
}

const db = new DB(process.env.DATABASE_URL)
Object.freeze(db)
module.exports = db
