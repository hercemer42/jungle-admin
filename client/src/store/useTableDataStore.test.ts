import { describe, it, expect, beforeEach, vi } from "vitest";
import { useTableDataStore } from "./useTableDataStore";
import { useTablesStore } from "./useTablesStore";
import { useToastStore } from "./useToastStore";
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
    primaryKeyColumns: ["id"],
  });
  useTablesStore.setState({ selectedTable: "customers" });
  useToastStore.setState({ toasts: [] });
  vi.clearAllMocks();
});

describe("row saving", () => {
  it("updates selectedRow and rows after saving", async () => {
    const updatedFromServer = { ...fakeRow, name: "Bob" };
    vi.mocked(tablesApi.saveRow).mockResolvedValue(updatedFromServer);

    await useTableDataStore.getState().updateRow({ name: "Bob" });

    expect(tablesApi.saveRow).toHaveBeenCalledWith(
      "customers",
      { name: "Bob" },
      [["id", 1]],
    );
    const state = useTableDataStore.getState();
    expect(state.selectedRow).toMatchObject({ name: "Bob" });
    expect(state.rows.find((r) => r.id === 1)).toMatchObject({ name: "Bob" });
  });

  it("does nothing when there is no selectedRow", async () => {
    useTableDataStore.setState({ selectedRow: null });

    await useTableDataStore.getState().updateRow({ name: "Bob" });

    expect(tablesApi.saveRow).not.toHaveBeenCalled();
  });

  it("does nothing when there is no selectedTable", async () => {
    useTablesStore.setState({ selectedTable: null });

    await useTableDataStore.getState().updateRow({ name: "Bob" });

    expect(tablesApi.saveRow).not.toHaveBeenCalled();
  });

  it("shows error toast when saveRow fails", async () => {
    vi.mocked(tablesApi.saveRow).mockRejectedValue(
      new Error("Duplicate key"),
    );

    await useTableDataStore.getState().updateRow({ name: "Bob" });

    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe("Duplicate key");
    expect(toasts[0].type).toBe("error");
  });

  it("converts datetime fields in the saved row", async () => {
    const updatedFromServer = {
      ...fakeRow,
      name: "Bob",
      createdAt: "2026-02-17T11:05:00.000Z",
    };
    vi.mocked(tablesApi.saveRow).mockResolvedValue(updatedFromServer);

    await useTableDataStore.getState().updateRow({ name: "Bob" });

    const state = useTableDataStore.getState();
    expect(state.selectedRow?.createdAt).toBe("2026-02-17T11:05");
  });
});

describe("column sorting", () => {
  it("sets sort direction to 'asc' when sorting a new column", () => {
    useTableDataStore.setState({ sortColumn: null, sortDirection: null });
    useTableDataStore.getState().setSortColumn("name");
    const state = useTableDataStore.getState();
    expect(state.sortColumn).toBe("name");
    expect(state.sortDirection).toBe("asc");
  });

  it("sets sort direction to 'desc' when clicking the same column again", () => {
    useTableDataStore.setState({ sortColumn: "name", sortDirection: "asc" });
    useTableDataStore.getState().setSortColumn("name");
    const state = useTableDataStore.getState();
    expect(state.sortColumn).toBe("name");
    expect(state.sortDirection).toBe("desc");
  });

  it("removes sorting when clicking the same column a third time", () => {
    useTableDataStore.setState({ sortColumn: "name", sortDirection: "desc" });
    useTableDataStore.getState().setSortColumn("name");
    const state = useTableDataStore.getState();
    expect(state.sortColumn).toBe(null);
    expect(state.sortDirection).toBe(null);
  });

  it("resets sort direction when switching to a different column", () => {
    useTableDataStore.setState({ sortColumn: "name", sortDirection: "desc" });
    useTableDataStore.getState().setSortColumn("totalSpent");
    const state = useTableDataStore.getState();
    expect(state.sortColumn).toBe("totalSpent");
    expect(state.sortDirection).toBe("asc");
  });
});

describe("table data loading", () => {
  it("sets the page count and page when loading table data", async () => {
    const tableData = {
      fields: tableProperties,
      rows: [fakeRow],
      pageCount: 5,
      page: 2,
    };
    vi.mocked(tablesApi.fetchTable).mockResolvedValue(tableData);

    await useTableDataStore.getState().loadTableData("customers");

    const state = useTableDataStore.getState();
    expect(state.pageCount).toBe(5);
    expect(state.page).toBe(2);
  });

  it("sets pageCount to 0 when server returns pageCount 0", async () => {
    useTableDataStore.setState({ pageCount: 5 });
    const tableData = {
      fields: tableProperties,
      rows: [],
      pageCount: 0,
      page: 1,
    };
    vi.mocked(tablesApi.fetchTable).mockResolvedValue(tableData);

    await useTableDataStore.getState().loadTableData("customers");

    const state = useTableDataStore.getState();
    expect(state.pageCount).toBe(0);
  });
});

describe("filter removal", () => {
  it("removes a filter property from columnFilters", () => {
    useTableDataStore.setState({
      columnFilters: { name: "Alice", totalSpent: "500" },
    });

    useTableDataStore.getState().removeFilterProperty("name");

    const state = useTableDataStore.getState();
    expect(state.columnFilters).toEqual({ totalSpent: "500" });
  });

  it("handles removing the only filter", () => {
    useTableDataStore.setState({ columnFilters: { name: "Alice" } });

    useTableDataStore.getState().removeFilterProperty("name");

    const state = useTableDataStore.getState();
    expect(state.columnFilters).toEqual({});
  });

  it("does not break when removing a non-existent filter", () => {
    useTableDataStore.setState({ columnFilters: { name: "Alice" } });

    useTableDataStore.getState().removeFilterProperty("totalSpent");

    const state = useTableDataStore.getState();
    expect(state.columnFilters).toEqual({ name: "Alice" });
  });
});

describe("table switching", () => {
  it("resets filters when switching tables", async () => {
    useTableDataStore.setState({
      columnFilters: { name: "Alice" },
    });
    vi.mocked(tablesApi.fetchTable).mockResolvedValue({
      fields: tableProperties,
      rows: [],
      pageCount: 0,
      page: 1,
      primaryKeyColumns: ["id"],
    });

    await useTablesStore.getState().setSelectedTable("orders");

    const state = useTableDataStore.getState();
    expect(state.columnFilters).toEqual({});
  });

  it("resets sort when switching tables", async () => {
    useTableDataStore.setState({
      sortColumn: "name",
      sortDirection: "desc",
    });
    vi.mocked(tablesApi.fetchTable).mockResolvedValue({
      fields: tableProperties,
      rows: [],
      pageCount: 0,
      page: 1,
      primaryKeyColumns: ["id"],
    });

    await useTablesStore.getState().setSelectedTable("orders");

    const state = useTableDataStore.getState();
    expect(state.sortColumn).toBe(null);
    expect(state.sortDirection).toBe("asc");
  });

  it("resets page to 1 when switching tables", async () => {
    useTableDataStore.setState({ page: 3, pageCount: 5 });
    vi.mocked(tablesApi.fetchTable).mockResolvedValue({
      fields: tableProperties,
      rows: [],
      pageCount: 0,
      page: 1,
      primaryKeyColumns: ["id"],
    });

    await useTablesStore.getState().setSelectedTable("orders");

    expect(tablesApi.fetchTable).toHaveBeenCalledWith(
      "orders",
      1,
      {},
      null,
      "asc",
    );
  });
});

describe("table data subscription", () => {
  it("resets the page to 1 when column filters are applied", () => {
    useTableDataStore.setState({ page: 3, pageCount: 5 });
    useTableDataStore.setState({ columnFilters: { name: "Alice" } });

    const state = useTableDataStore.getState();
    expect(state.page).toBe(1);
  });

  it("resets the page to 1 when column filters are cleared", () => {
    useTableDataStore.setState({
      page: 3,
      pageCount: 5,
      columnFilters: { name: "Alice" },
    });
    useTableDataStore.setState({ columnFilters: {} });

    const state = useTableDataStore.getState();
    expect(state.page).toBe(1);
  });

  it("resets the page to 1 when sort column is changed", () => {
    useTableDataStore.setState({ page: 3, pageCount: 5 });
    useTableDataStore.getState().setSortColumn("name");

    const state = useTableDataStore.getState();
    expect(state.page).toBe(1);
  });

  it("resets the page to 1 when sort direction is changed", () => {
    useTableDataStore.setState({
      page: 3,
      pageCount: 5,
      sortColumn: "name",
      sortDirection: "asc",
    });
    useTableDataStore.getState().setSortDirection("desc");

    const state = useTableDataStore.getState();
    expect(state.page).toBe(1);
  });
});
