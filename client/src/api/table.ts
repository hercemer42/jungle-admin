export async function fetchTable(name: string) {
  const response = await fetch(`/api/table/${name}`);
  if (!response.ok) {
    throw new Error("Failed to fetch table");
  }
  const data = await response.json();
  return data;
}
