import { MongoClient, Db, MongoClientOptions } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017';
const MONGO_DB = process.env.MONGO_DB ?? 'harmony';

declare global {
  // allow global across module reloads in dev
  // eslint-disable-next-line no-var
  var __mongoClient__: { client?: MongoClient; db?: Db } | undefined;
}

function buildMongoOptions(): MongoClientOptions {
  const options: MongoClientOptions = {
    // Reasonable timeouts; let driver manage TLS for SRV URIs
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
    // retryReads/writes are enabled by default for Atlas-compatible URIs
  };

  // Optional: support custom corporate/intercepting CA
  // Provide a path to a PEM bundle via MONGODB_CA_FILE
  if (process.env.MONGODB_CA_FILE) {
    options.tlsCAFile = process.env.MONGODB_CA_FILE;
  }

  // Controlled escape hatch for debugging only
  if (process.env.MONGO_TLS_INSECURE === '1') {
    // Equivalent to rejectUnauthorized: false
    // Not recommended for production
    // The driver forwards this to Node's TLS options in recent versions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (options as any).tlsInsecure = true;
    console.warn('[mongodb] MONGO_TLS_INSECURE=1 set. TLS certificate validation is disabled for debugging.');
  }

  return options;
}

export async function connectToDatabase() {
  if (global.__mongoClient__ && global.__mongoClient__.client) {
    return { client: global.__mongoClient__.client, db: global.__mongoClient__.db! };
  }

  if (!MONGO_URI) {
    throw new Error('MongoDB connection string is missing. Set MONGO_URI.');
  }

  // Guard against common URI scheme typo reported in logs: 'mongodbs://'
  if (MONGO_URI.startsWith('mongodbs://')) {
    throw new Error("Invalid MONGO_URI scheme 'mongodbs://'. Use 'mongodb+srv://' for Atlas clusters or 'mongodb://' for direct connections.");
  }

  const options = buildMongoOptions();
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    // Quick ping to fail fast with clearer diagnostics
    await client.db('admin').command({ ping: 1 });
  } catch (err: any) {
    // Add helpful hints without exposing secrets
    const hints = [
      'Verify your current IP is allowed in MongoDB Atlas Network Access.',
      'Ensure the SRV URI is correct and includes your username/password.',
      'If behind a corporate proxy/SSL inspection, set NODE_OPTIONS=--use-openssl-ca and NODE_EXTRA_CA_CERTS to your root CA, or set MONGODB_CA_FILE to a PEM bundle.',
      'Use Node.js 18+ (Node runtime must support TLS 1.2/1.3).',
    ];

    const sanitizedUri = (() => {
      try {
        const isSrv = MONGO_URI.startsWith('mongodb+srv://');
        const isStd = MONGO_URI.startsWith('mongodb://');
        const replaced = MONGO_URI
          .replace('mongodb+srv://', 'https://')
          .replace('mongodb://', 'http://');
        const u = new URL(replaced);
        const scheme = isSrv ? 'mongodb+srv' : isStd ? 'mongodb' : 'mongodb';
        return `${scheme}://${u.hostname}${u.pathname}`;
      } catch {
        return '<redacted>';
      }
    })();

    console.error('MongoDB connection failed:', {
      name: err?.name,
      code: err?.code,
      reason: err?.reason,
      message: err?.message,
      node: process.versions.node,
      openssl: process.versions.openssl,
      caFile: Boolean(process.env.MONGODB_CA_FILE),
      tlsInsecure: process.env.MONGO_TLS_INSECURE === '1',
      uri: sanitizedUri,
    });
    console.error('Troubleshooting hints:', hints);
    throw err;
  }

  const db = client.db(MONGO_DB);
  global.__mongoClient__ = { client, db };
  return { client, db };
}

export type { Db };
