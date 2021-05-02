require('dotenv').config();
const db = require('./db');
const bot = require('./bot');

db.connect()
  .then(() => {
    console.log('Connected to postgres');
    bot
      .startPolling()
      .catch((error) => {
        console.error('Can not start polling');
        throw error;
      });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:');
    throw error;
  });

process.on('exit', async (code) => {
  console.log(`Exit with code ${code}, stopping...`);
  await bot.stopPolling();
  await db.disconnect();
  console.log('Bye!');
});
