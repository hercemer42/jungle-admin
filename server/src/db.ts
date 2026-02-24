import pg from "pg";

// Return date columns as plain strings (YYYY-MM-DD) instead of JS Date objects,
// which would shift the date due to timezone conversion.
pg.types.setTypeParser(1082, (val: string) => val);

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
});

export { pool };
