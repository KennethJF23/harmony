import { MongoClient, Db } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const MONGO_DB = process.env.MONGO_DB || 'harmony';

declare global {
  // allow global across module reloads in dev
  // eslint-disable-next-line no-var
  var __mongoClient__: { client?: MongoClient; db?: Db } | undefined;
}

export async function connectToDatabase() {
  if (global.__mongoClient__ && global.__mongoClient__.client) {
    return { client: global.__mongoClient__.client, db: global.__mongoClient__.db! };
  }

  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(MONGO_DB);

  global.__mongoClient__ = { client, db };
  return { client, db };
}

export type { Db };
