import { describe, it, expect, beforeEach, vi } from "vitest";
import { useTableDataStore } from "./useTableDataStore";
import { useTablesStore } from "./useTablesStore";
import * as tablesApi from "../api/tables";

vi.mock("../api/tables", () => ({
  fetchTable: vi.fn(),
  fetchTables: vi.fn(),
  saveRow: vi.fn(),
}));

const fakeRow = {
  id: 1,
  name: "Alice",
  totalSpent: 500,
  isActive: true,
  createdAt: "2026-02-17T11:05:00.000Z",
};

const tableProperties = [
  { name: "id", type: "number", editable: false },
  { name: "name", type: "text", editable: true },
  { name: "totalSpent", type: "number", editable: true },
  { name: "isActive", type: "checkbox", editable: true },
  { name: "createdAt", type: "datetime-local", editable: false },
];

beforeEach(() => {
  useTableDataStore.setState({
    rows: [fakeRow],
    selectedRow: fakeRow,
    tableProperties,
  });
  useTablesStore.setState({ currentTable: "customers" });
  vi.clearAllMocks();
});

describe("useTableDataStore.saveRow", () => {
  it("updates selectedRow and rows after saving", async () => {
    const updatedFromServer = { ...fakeRow, name: "Bob" };
    vi.mocked(tablesApi.saveRow).mockResolvedValue(updatedFromServer);

    await useTableDataStore.getState().saveRow({ name: "Bob" });

    expect(tablesApi.saveRow).toHaveBeenCalledWith(
      "customers",
      { name: "Bob" },
      1,
    );
    const state = useTableDataStore.getState();
    expect(state.selectedRow).toMatchObject({ name: "Bob" });
    expect(state.rows.find((r) => r.id === 1)).toMatchObject({ name: "Bob" });
  });

  it("does nothing when there is no selectedRow", async () => {
    useTableDataStore.setState({ selectedRow: null });

    await useTableDataStore.getState().saveRow({ name: "Bob" });

    expect(tablesApi.saveRow).not.toHaveBeenCalled();
  });

  it("does nothing when there is no currentTable", async () => {
    useTablesStore.setState({ currentTable: null });

    await useTableDataStore.getState().saveRow({ name: "Bob" });

    expect(tablesApi.saveRow).not.toHaveBeenCalled();
  });

  it("converts datetime fields in the saved row", async () => {
    const updatedFromServer = {
      ...fakeRow,
      name: "Bob",
      createdAt: "2026-02-17T11:05:00.000Z",
    };
    vi.mocked(tablesApi.saveRow).mockResolvedValue(updatedFromServer);

    await useTableDataStore.getState().saveRow({ name: "Bob" });

    const state = useTableDataStore.getState();
    expect(state.selectedRow?.createdAt).toBe("2026-02-17T11:05");
  });
});
