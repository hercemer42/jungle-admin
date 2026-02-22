import { pool } from "../db";

let cachedTableNames: string[] | null = null;

class QueryError extends Error {
  constructor(
    message: string,
    public status: number = 500,
  ) {
    super(message);
  }
}

const clearCache = () => {
  cachedTableNames = null;
};

const getTableNames = async () => {
  if (cachedTableNames) {
    return cachedTableNames;
  }

  const entries = await pool
    .query(
      `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `,
    )
    .catch((err) => {
      console.error(err);
      throw new QueryError("Failed to fetch table names", 500);
    });

  cachedTableNames = entries.rows.map((row: any) => row.table_name);
  return cachedTableNames;
};

const getTableData = async (tableName: string) => {
  if (!cachedTableNames) {
    await getTableNames();
  }

  if (cachedTableNames && cachedTableNames.includes(tableName)) {
    const entries = await pool
      .query(`SELECT * FROM ${tableName}  `)
      .catch((err) => {
        console.error(err);
        throw new QueryError(
          `Failed to fetch data for table "${tableName}"`,
          500,
        );
      });
    return entries.rows;
  } else {
    throw new QueryError(`Table "${tableName}" does not exist`, 404);
  }
};

export { getTableNames, getTableData, clearCache };
