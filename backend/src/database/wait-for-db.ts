import mysql from 'mysql2/promise';

function getConnectionConfig() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  const parsedUrl = new URL(databaseUrl);

  return {
    host: parsedUrl.hostname,
    port: Number(parsedUrl.port || 3306),
    user: decodeURIComponent(parsedUrl.username),
    password: decodeURIComponent(parsedUrl.password),
    database: parsedUrl.pathname.replace(/^\//, ''),
  };
}

async function waitForDatabase() {
  const config = getConnectionConfig();
  const retries = Number(process.env.DB_WAIT_RETRIES ?? 40);
  const delayMs = Number(process.env.DB_WAIT_DELAY_MS ?? 3000);

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const connection = await mysql.createConnection(config);
      await connection.ping();
      await connection.end();
      console.log(`Database is reachable on attempt ${attempt}`);
      return;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown database error';
      console.log(`Waiting for database (${attempt}/${retries}): ${message}`);

      if (attempt === retries) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

waitForDatabase().catch((error) => {
  console.error('Database did not become ready in time', error);
  process.exit(1);
});
