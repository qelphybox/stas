require('dotenv').config()
const db = require('./db')
const youtube = require('./youtube')

describe.skip('manual runs for now', () => {
  test('follow', async () => {
    try {
      await db.connect()
      await youtube.follow('mychat', 'https://www.youtube.com/playlist?list=PLU07HAmXSEyc7ROmO4pVsnVcr5_rfjHQP')
    } finally {
      await db.disconnect()
    }
  })

  test('unfollow', async () => {
    try {
      await db.connect()
      await youtube.unfollow('mychat')
    } finally {
      await db.disconnect()
    }
  })

  test('append', async () => {
    try {
      await db.connect()
      await youtube.append('mychat', 'https://www.youtube.com/watch?v=5qap5aO4i9A')
    } finally {
      await db.disconnect()
    }
  })
})
