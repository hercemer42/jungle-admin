import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tables } from "./Tables";
import styles from "./Tables.module.css";
import { useTablesStore } from "../../store/useTablesStore";
import { useTableDataStore } from "../../store/useTableDataStore";
import * as tablesApi from "../../api/tables";

vi.mock("../../api/tables", () => ({
  fetchTable: vi.fn(),
  fetchTables: vi.fn(),
  saveRow: vi.fn(),
}));

beforeEach(() => {
  useTablesStore.setState({
    tables: ["customers", "orders", "order_items"],
    selectedTable: "customers",
    loading: false,
  });
  useTableDataStore.setState({
    tableProperties: [],
    rows: [],
    columnFilters: {},
    sortColumn: null,
    sortDirection: "asc",
    page: 1,
    pageCount: 0,
    primaryKeyColumns: [],
  });
  vi.clearAllMocks();
});

describe("Tables", () => {
  it("renders table names formatted", () => {
    render(<Tables />);
    expect(screen.getByText("Customers")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Order Items")).toBeInTheDocument();
  });

  it("highlights the selected table", () => {
    render(<Tables />);
    const selected = screen.getByText("Customers").closest("li");
    expect(selected).toHaveClass(styles.selected);
  });

  it("does not highlight unselected tables", () => {
    render(<Tables />);
    const unselected = screen.getByText("Orders").closest("li");
    expect(unselected).not.toHaveClass(styles.selected);
  });

  it("calls setSelectedTable when a table is clicked", async () => {
    vi.mocked(tablesApi.fetchTable).mockResolvedValue({
      fields: [],
      rows: [],
      pageCount: 0,
      page: 1,
      primaryKeyColumns: [],
    });
    render(<Tables />);
    await userEvent.click(screen.getByText("Orders"));
    expect(useTablesStore.getState().selectedTable).toBe("orders");
  });

  it("shows loading spinner when loading is true", () => {
    useTablesStore.setState({ loading: true });
    render(<Tables />);
    expect(screen.queryByRole("status")).toBeInTheDocument();
  });

  it("does not show loading spinner when loading is false", () => {
    useTablesStore.setState({ loading: false, loadTables: async () => {} });
    render(<Tables />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
