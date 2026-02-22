export async function fetchTables() {
  const response = await fetch("/api/tables");
  if (!response.ok) {
    throw new Error("Failed to fetch tables");
  }
  const data = await response.json();
  return data.tableNames;
}

export async function fetchTable(name: string) {
  const response = await fetch(`/api/tables/${name}`);
  if (!response.ok) {
    throw new Error("Failed to fetch table");
  }
  const data = await response.json();
  return data;
}

export async function saveRow(
  tableName: string,
  updatedRow: Record<string, any>,
  id: number,
) {
  console.log("saveRow called with", { tableName, updatedRow });
  const response = await fetch(`/api/tables/${tableName}/rows/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedRow),
  });
  if (!response.ok) {
    throw new Error("Failed to save row");
  }
  const data = await response.json();
  return data;
}
