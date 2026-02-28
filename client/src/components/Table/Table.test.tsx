import { beforeEach, describe, expect, it } from "vitest";
import { useTableDataStore } from "../../store/useTableDataStore";
import { useTablesStore } from "../../store/useTablesStore";
import { act, render, screen } from "@testing-library/react";
import { Table } from "./Table";
import userEvent from "@testing-library/user-event";
import type { Field } from "../../types/types";

const tableProperties: Field[] = [
  { name: "id", type: "number", editable: false },
  { name: "name", type: "text", editable: true },
  { name: "totalSpent", type: "number", editable: true },
  { name: "isActive", type: "checkbox", editable: true },
  { name: "dateOfBirth", type: "date", editable: true },
  { name: "createdAt", type: "datetime-local", editable: false },
];

const rows = [
  {
    id: 1,
    name: "Quinn Lewis",
    totalSpent: 25,
    isActive: true,
    dateOfBirth: "1990-01-15",
    createdAt: "2026-02-17T11:05",
  },
  {
    id: 2,
    name: "Eve Davis",
    totalSpent: 500,
    isActive: false,
    dateOfBirth: "1985-07-22",
    createdAt: "2026-02-17T11:05",
  },
  {
    id: 3,
    name: "Charlie Brown",
    totalSpent: 0,
    isActive: true,
    dateOfBirth: "1992-03-10",
    createdAt: "2026-02-17T11:05",
  },
  {
    id: 4,
    name: "Uma Allen",
    totalSpent: 100,
    isActive: true,
    dateOfBirth: "1988-11-28",
    createdAt: "2026-02-17T11:05",
  },
  {
    id: 5,
    name: "Alice Smith",
    totalSpent: 50,
    isActive: false,
    dateOfBirth: "1995-06-03",
    createdAt: "2026-02-17T11:05",
  },
  {
    id: 6,
    name: "Hank Taylor",
    totalSpent: 0,
    isActive: true,
    dateOfBirth: "1979-09-17",
    createdAt: "2026-02-17T11:05",
  },
  {
    id: 7,
    name: "Nina Rodriguez",
    totalSpent: 10,
    isActive: true,
    dateOfBirth: "1993-12-01",
    createdAt: "2026-02-17T11:05",
  },
  {
    id: 8,
    name: "Leo Martin",
    totalSpent: 5,
    isActive: false,
    dateOfBirth: "1982-04-25",
    createdAt: "2026-02-17T11:05",
  },
  {
    id: 9,
    name: "Sara Hall",
    totalSpent: 2,
    isActive: true,
    dateOfBirth: "1991-08-14",
    createdAt: "2026-02-17T11:05",
  },
  {
    id: 10,
    name: "Jack Thomas",
    totalSpent: 4,
    isActive: true,
    dateOfBirth: "1987-02-20",
    createdAt: "2026-02-17T11:05",
  },
];

beforeEach(() => {
  useTableDataStore.setState({
    tableProperties,
    selectedRow: null,
    primaryKeyColumns: ["id"],
    sortColumn: null,
    sortDirection: "asc",
    rows: rows,
    columnFilters: {},
  });
});

describe("Table", () => {
  it("renders the table headers", () => {
    render(<Table />);
    expect(document.querySelectorAll("th")).toHaveLength(6);
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Total Spent")).toBeInTheDocument();
    expect(screen.getByText("Is Active")).toBeInTheDocument();
    expect(screen.getByText("Date Of Birth")).toBeInTheDocument();
    expect(screen.getByText("Created At")).toBeInTheDocument();
  });

  it("displays 'No results found' when there are no rows", () => {
    useTableDataStore.setState({ rows: [] });
    useTablesStore.setState({ selectedTable: "customers" });
    render(<Table />);
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("renders the correct number of rows", () => {
    render(<Table />);
    expect(document.querySelectorAll("tbody tr")).toHaveLength(10);
  });

  it("renders the correct number of cells in each row", () => {
    render(<Table />);
    const current_rows = document.querySelectorAll("tbody tr");
    for (const row of current_rows) {
      expect(row.querySelectorAll("td")).toHaveLength(6);
    }
  });

  it("shows loading spinner when loading is true", () => {
    useTableDataStore.setState({ loading: true });
    render(<Table />);
    expect(document.querySelector(".loading-spinner")).toBeInTheDocument();
  });

  it("does not show loading spinner when loading is false", () => {
    useTableDataStore.setState({ loading: false });
    render(<Table />);
    expect(document.querySelector(".loading-spinner")).not.toBeInTheDocument();
  });

  it("renders the correct cell values", () => {
    render(<Table />);
    expect(screen.getByText("Quinn Lewis")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getAllByText("Yes").length).toBeGreaterThan(0);
  });

  it("opens a row when it is clicked", async () => {
    render(<Table />);
    await userEvent.click(screen.getByText("Quinn Lewis"));
    const selectedRow = useTableDataStore.getState().selectedRow;
    expect(selectedRow).toEqual({
      id: 1,
      name: "Quinn Lewis",
      totalSpent: 25,
      isActive: true,
      dateOfBirth: "1990-01-15",
      createdAt: "2026-02-17T11:05",
    });
  });

  it("sets the sort indicator to asc when a column is clicked", async () => {
    render(<Table />);
    await userEvent.click(screen.getByText("Name"));
    expect(screen.getByText("Name ▲")).toBeInTheDocument();
  });

  it("sets the sort indicator to desc when a column is clicked twice", async () => {
    render(<Table />);
    await userEvent.click(screen.getByText("Name"));
    await userEvent.click(screen.getByText("Name ▲"));
    expect(screen.getByText("Name ▼")).toBeInTheDocument();
  });

  it("removes the sort indicator when the same header is clicked three times", async () => {
    render(<Table />);
    await userEvent.click(screen.getByText("Name"));
    await userEvent.click(screen.getByText("Name ▲"));
    await userEvent.click(screen.getByText("Name ▼"));
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("it changes sort indicator to ▲ when a different header is clicked", async () => {
    render(<Table />);
    await userEvent.click(screen.getByText("Name"));
    expect(screen.getByText("Name ▲")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Name ▲"));
    expect(screen.getByText("Name ▼")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Total Spent"));
    expect(screen.getByText("Total Spent ▲")).toBeInTheDocument();
  });

  it("resets to the first page when a header is clicked", async () => {
    useTableDataStore.setState({ page: 3, pageCount: 3 });
    render(<Table />);
    expect(screen.getByText(/3 of 3/)).toBeInTheDocument();
    await userEvent.click(screen.getByText("Name"));
    expect(screen.getByText(/1 of 3/)).toBeInTheDocument();
  });

  it("resets to the first page when columnFilters are applied", async () => {
    useTableDataStore.setState({ page: 3, pageCount: 3 });
    render(<Table />);
    expect(screen.getByText(/3 of 3/)).toBeInTheDocument();
    act(() => useTableDataStore.setState({ columnFilters: { name: "Alice" } }));
    expect(screen.getByText(/1 of 3/)).toBeInTheDocument();
  });

  it("resets to the first page when columnFilters are cleared", async () => {
    useTableDataStore.setState({ page: 3, pageCount: 3 });
    render(<Table />);
    expect(screen.getByText(/3 of 3/)).toBeInTheDocument();
    act(() => useTableDataStore.setState({ columnFilters: { name: "Alice" } }));
    expect(screen.getByText(/1 of 3/)).toBeInTheDocument();
    act(() => useTableDataStore.setState({ columnFilters: { name: "" } }));
    expect(screen.getByText(/1 of 3/)).toBeInTheDocument();
  });
});
