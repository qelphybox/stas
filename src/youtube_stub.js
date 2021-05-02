class YoutubeManager {
  constructor() {
    this.links = {};
  }

  async follow(chatId, url) {
    this.links[chatId] = url;
    console.log(`STUB: This chat ${chatId} is following playlist ${url}, please send youtube links`)
    return true
  }

  async addToFollowing(chatId, songUrl) {
    console.log(`STUB: Add to ${songUrl} ${this.links[chatId]}`);
  }

  async isFollowing(chatId) {
    return this.links.hasOwnProperty(chatId);
  }
}

const youtubeManager = new YoutubeManager();
module.exports = youtubeManager;
