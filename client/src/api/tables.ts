export async function fetchTables() {
  const response = await fetch("/api/tables");
  if (!response.ok) {
    throw new Error("Failed to fetch tables");
  }
  const data = await response.json();
  return data.tableNames;
}
