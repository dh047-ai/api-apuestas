const { MongoClient } = require('mongodb');

let client;
let db;

async function getDb() {
  if (!db) {
    client = new MongoClient(process.env.MONGO_URL);
    await client.connect();
    db = client.db(process.env.MONGO_DB);
  }
  return db;
}

module.exports = { getDb };
