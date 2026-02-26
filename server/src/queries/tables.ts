import { pool } from "../db";
import type { ConstraintRow, SortDirection } from "../types/types";
import { QueryError } from "../utils/errors";
import { getDataFromPostgresField, validateParameter } from "../utils/utils";

const PAGE_LIMIT = 10;

let cachedTableNames: string[] | null = null;

const clearCache = () => {
  cachedTableNames = null;
};

const getTableNames = async () => {
  if (cachedTableNames) {
    return cachedTableNames;
  }

  const entries = await pool
    .query<{ table_name: string }>(
      `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `,
    )
    .catch((err) => {
      throw new QueryError("Failed to fetch table names", 500, err);
    });

  cachedTableNames = entries.rows.map((row) => row.table_name);
  return cachedTableNames;
};

const ensureTableExists = async (tableName: string) => {
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
};

const getTableData = async (
  tableName: string,
  page: number,
  sortColumn?: string | undefined,
  sortDirection?: SortDirection,
  columnFilters?: Record<string, string> | undefined,
) => {
  await ensureTableExists(tableName);

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

  const filterColumns = columnFilters ? Object.keys(columnFilters) : [];
  const filterParams = columnFilters ? Object.values(columnFilters) : [];

  const whereClause =
    filterColumns.length > 0
      ? "WHERE " +
        filterColumns
          .map((col, index) => `${col}::text ILIKE '%' || $${index + 1} || '%'`)
          .join(" AND ")
      : "";

  const orderClause = sortColumn
    ? `ORDER BY ${sortColumn} ${sortDirection === "desc" ? "DESC" : "ASC"}`
    : "";

  const [rows, meta, constraints] = await Promise.all([
    pool.query(
      `SELECT * FROM ${tableName}
       ${whereClause}
       ${orderClause}
       LIMIT $${filterParams.length + 1} OFFSET $${filterParams.length + 2}`,
      [...filterParams, PAGE_LIMIT, (page - 1) * PAGE_LIMIT],
    ),
    pool.query<{ total_count: number; page_count: number }>(
      `SELECT COUNT(*)::integer AS total_count,
              CEIL(COUNT(*)::numeric / $${filterParams.length + 1})::integer AS page_count
       FROM ${tableName}
       ${whereClause}`,
      [...filterParams, PAGE_LIMIT],
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
    throw new QueryError(
      `Failed to fetch data for table "${tableName}"`,
      500,
      err,
    );
  });

  const nonEditableColumns = new Set<string>();
  const primaryKeyColumns = new Set<string>();
  for (const row of constraints.rows as ConstraintRow[]) {
    nonEditableColumns.add(row.column_name);
    if (row.constraint_type === "PRIMARY KEY") {
      primaryKeyColumns.add(row.column_name);
    }
  }

  return {
    fields: rows.fields.map((field) =>
      getDataFromPostgresField(field, nonEditableColumns, primaryKeyColumns),
    ),
    rows: rows.rows,
    pageCount: meta.rows[0]?.page_count ?? 0,
    totalCount: meta.rows[0]?.total_count ?? 0,
    primaryKeyColumns: Array.from(primaryKeyColumns),
  };
};

const saveRow = async (
  tableName: string,
  updatedRow: Record<string, unknown>,
  primaryKeys: [string, string | number][],
) => {
  await ensureTableExists(tableName);

  for (const col of Object.keys(updatedRow)) {
    if (!validateParameter(col)) {
      throw new QueryError(`Invalid column name in updated row: "${col}"`, 400);
    }
  }

  for (const [key] of primaryKeys) {
    if (!validateParameter(key)) {
      throw new QueryError(`Invalid primary key column name: "${key}"`, 400);
    }
  }

  const setClauses = Object.keys(updatedRow)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = Object.values(updatedRow);

  const query = `
    UPDATE ${tableName}
    SET ${setClauses}
    WHERE ${primaryKeys.map(([key], index) => `${key} = $${values.length + index + 1}`).join(" AND ")}
    RETURNING *
  `;

  const result = await pool
    .query(query, [...values, ...primaryKeys.map(([, value]) => value)])
    .catch((err) => {
      throw new QueryError(
        `Failed to save row in table "${tableName}"`,
        500,
        err,
      );
    });

  if (result.rows.length === 0) {
    throw new QueryError(
      `Row with primary keys "${primaryKeys.map(([key, value]) => `${key}:${value}`).join(", ")}" not found in table "${tableName}"`,
      404,
    );
  }

  return result.rows[0];
};

export { getTableNames, getTableData, clearCache, saveRow };
