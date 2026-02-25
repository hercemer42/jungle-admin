import { pool } from "../db";
import { getDataFromPostgresField, validateParameter } from "../utils/utils";

let cachedTableNames: string[] | null = null;
type sortDirection = "asc" | "desc";

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

const getTableData = async (
  tableName: string,
  page: number,
  sortColumn?: string | undefined,
  sortDirection?: sortDirection,
  columnFilters?: Record<string, any> | undefined,
) => {
  if (!cachedTableNames) {
    await getTableNames();
  }

  if (!cachedTableNames) {
    throw new QueryError("Failed to fetch table names", 500);
  }

  if (!validateParameter(tableName)) {
    throw new QueryError("Invalid table name", 400);
  }

  if (!cachedTableNames.includes(tableName)) {
    throw new QueryError(`Table "${tableName}" does not exist`, 404);
  }

  if (typeof page !== "number" || isNaN(page)) {
    throw new QueryError("Page number must be a valid number", 400);
  }

  if (page < 1) {
    throw new QueryError("Page number must be greater than 0", 400);
  }

  if (sortColumn && !validateParameter(sortColumn)) {
    throw new QueryError("Invalid sort column name", 400);
  }

  if (columnFilters) {
    for (const col in columnFilters) {
      if (!validateParameter(col)) {
        throw new QueryError(
          `Invalid column name in columnFilters: "${col}"`,
          400,
        );
      }
    }
  }

  const page_limit = 10;
  const filterColumns = columnFilters ? Object.keys(columnFilters) : [];
  const filterParams = columnFilters
    ? Object.values(columnFilters).map(String)
    : [];

  const whereClause =
    filterColumns.length > 0
      ? "WHERE " +
        filterColumns
          .map((col, index) => `${col}::text ILIKE '%' || $${index + 1} || '%'`)
          .join(" AND ")
      : "";

  const [entries, constraints] = await Promise.all([
    pool.query(
      `
      WITH table_meta AS (
        SELECT
          COUNT(*) AS total_count,
          CEIL(COUNT(*)::numeric / ${page_limit}) AS page_count
        FROM ${tableName}
        ${whereClause}
      )
      SELECT t.*, tm.total_count::integer, tm.page_count::integer
      FROM ${tableName} t, table_meta tm
      ${whereClause}
      ${
        sortColumn
          ? `ORDER BY ${sortColumn} ${sortDirection === "desc" ? "DESC" : "ASC"}`
          : ""
      }
      LIMIT ${page_limit} OFFSET ${(page - 1) * page_limit}
     `,
      filterParams,
    ),
    pool.query(
      `SELECT kcu.column_name, tc.constraint_type
       FROM information_schema.table_constraints tc
       JOIN information_schema.key_column_usage kcu
         ON tc.constraint_name = kcu.constraint_name
       WHERE tc.table_name = $1
         AND tc.constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY')`,
      [tableName],
    ),
  ]).catch((err) => {
    console.error(err);
    throw new QueryError(`Failed to fetch data for table "${tableName}"`, 500);
  });

  const nonEditableColumns = new Set<string>(
    constraints.rows.map((row: any) => row.column_name),
  );
  const primaryKeyColumns = new Set<string>(
    constraints.rows
      .filter((row: any) => row.constraint_type === "PRIMARY KEY")
      .map((row: any) => row.column_name),
  );

  return {
    fields: entries.fields
      .filter(
        (field: any) =>
          field.name !== "total_count" && field.name !== "page_count",
      )
      .map((field: any) =>
        getDataFromPostgresField(field, nonEditableColumns, primaryKeyColumns),
      ),
    rows: entries.rows.map(({ total_count, page_count, ...row }: any) => row),
    pageCount: entries.rows.length > 0 ? entries.rows[0].page_count : 0,
    totalCount: entries.rows.length > 0 ? entries.rows[0].total_count : 0,
  };
};

const saveRow = async (
  tableName: string,
  rowId: string,
  updatedRow: Record<string, any>,
) => {
  if (!cachedTableNames) {
    await getTableNames();
  }
  if (!cachedTableNames) {
    throw new QueryError("Failed to fetch table names", 500);
  }

  if (!validateParameter(tableName)) {
    throw new QueryError("Invalid table name", 400);
  }

  if (!cachedTableNames.includes(tableName)) {
    throw new QueryError(`Table "${tableName}" does not exist`, 404);
  }

  for (const col of Object.keys(updatedRow)) {
    if (!validateParameter(col)) {
      throw new QueryError(`Invalid column name in updated row: "${col}"`, 400);
    }
  }

  const setClauses = Object.keys(updatedRow)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = Object.values(updatedRow);

  const query = `
    UPDATE ${tableName}
    SET ${setClauses}
    WHERE id = $${values.length + 1}
    RETURNING *
  `;

  const result = await pool.query(query, [...values, rowId]).catch((err) => {
    console.error(err);
    throw new QueryError(`Failed to save row in table "${tableName}"`, 500);
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
