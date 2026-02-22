import { pool } from "../db";
import { getDataFromPostgresField } from "../utils/utils";

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

  if (!cachedTableNames) {
    throw new QueryError("Failed to fetch table names", 500);
  }

  if (cachedTableNames.includes(tableName)) {
    const [entries, constraints] = await Promise.all([
      pool.query(`SELECT * FROM ${tableName} ORDER BY ID  `),
      pool.query(
        `SELECT kcu.column_name
         FROM information_schema.table_constraints tc
         JOIN information_schema.key_column_usage kcu
           ON tc.constraint_name = kcu.constraint_name
         WHERE tc.table_name = $1
           AND tc.constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY')`,
        [tableName],
      ),
    ]).catch((err) => {
      console.error(err);
      throw new QueryError(
        `Failed to fetch data for table "${tableName}"`,
        500,
      );
    });

    const nonEditableColumns = new Set<string>(
      constraints.rows.map((row: any) => row.column_name),
    );

    return {
      fields: entries.fields.map((field: any) =>
        getDataFromPostgresField(field, nonEditableColumns),
      ),
      rows: entries.rows,
    };
  } else {
    throw new QueryError(`Table "${tableName}" does not exist`, 404);
  }
};

const saveRow = async (
  tableName: string,
  rowId: string,
  updatedRow: Record<string, any>,
) => {
  const setClauses = Object.keys(updatedRow)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = Object.values(updatedRow);
  if (!cachedTableNames) {
    await getTableNames();
  }
  if (!cachedTableNames) {
    throw new QueryError("Failed to fetch table names", 500);
  }

  if (!cachedTableNames.includes(tableName)) {
    throw new QueryError(`Table "${tableName}" does not exist`, 404);
  }

  const query = `
    UPDATE ${tableName}
    SET ${setClauses}
    WHERE id = $${values.length + 1}
    RETURNING *
  `;

  const result = await pool.query(query, [...values, rowId]).catch((err) => {
    console.error(err);
    throw new QueryError(
      `Failed to save row with id "${rowId}" in table "${tableName}"`,
      500,
    );
  });

  if (result.rows.length === 0) {
    throw new QueryError(
      `Row with id "${rowId}" not found in table "${tableName}"`,
      404,
    );
  }

  return result.rows[0];
};

export { getTableNames, getTableData, clearCache, saveRow };
