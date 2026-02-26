import type { ColumnFilters } from "../types/types";

export async function fetchTables() {
  const response = await fetch("/api/tables");
  if (!response.ok) {
    throw new Error("Failed to fetch tables");
  }
  const data = await response.json();
  return data.tableNames;
}

export async function fetchTable(
  name: string,
  page: number,
  columnFilters: ColumnFilters,
  sortColumn: string | null,
  sortDirection: "asc" | "desc" | null,
) {
  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  if (sortColumn) {
    queryParams.append("sortColumn", sortColumn);
  }
  if (sortDirection) {
    queryParams.append("sortDirection", sortDirection);
  }
  for (const [key, value] of Object.entries(columnFilters)) {
    if (value) {
      queryParams.append(`columnFilters[${key}]`, value);
    }
  }
  const response = await fetch(`/api/tables/${name}?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch table");
  }
  const data = await response.json();
  return data;
}

export async function saveRow(
  tableName: string,
  updatedRow: Record<string, any>,
  primaryKeys: [string, string | number][],
) {
  const queryParams = new URLSearchParams();
  primaryKeys.forEach(([key, value]) => {
    queryParams.append(`primaryKeys[${key}]`, value.toString());
  });
  const response = await fetch(
    `/api/tables/${tableName}/rows/?${queryParams.toString()}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRow),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to save row");
  }
  const data = await response.json();
  return data;
}
