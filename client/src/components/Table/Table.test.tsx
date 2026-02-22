import { beforeEach, describe, expect, it } from "vitest";
import { useTableDataStore, type Field } from "../../store/useTableDataStore";
import { useTablesStore } from "../../store/useTablesStore";
import { act, render, screen } from "@testing-library/react";
import { Table } from "./Table";
import userEvent from "@testing-library/user-event";

const tableProperties: Field[] = [
  { name: "id", type: "number" },
  { name: "name", type: "text" },
  { name: "totalSpent", type: "number" },
  { name: "isActive", type: "checkbox" },
  { name: "dateOfBirth", type: "date" },
  { name: "createdAt", type: "datetime-local" },
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
  {
    id: 11,
    name: "Frank Miller",
    totalSpent: 0,
    isActive: true,
    dateOfBirth: "1994-05-12",
    createdAt: "2026-02-20T14:00",
  },
  {
    id: 12,
    name: "Victor King",
    totalSpent: 0,
    isActive: false,
    dateOfBirth: "1989-10-30",
    createdAt: "2026-02-20T14:00",
  },
  {
    id: 13,
    name: "Oscar Hernandez",
    totalSpent: 0,
    isActive: true,
    dateOfBirth: "1996-01-08",
    createdAt: "2026-02-20T14:00",
  },
  {
    id: 14,
    name: "Bob Johnson",
    totalSpent: 300,
    isActive: true,
    dateOfBirth: "1983-07-19",
    createdAt: "2026-02-20T14:00",
  },
  {
    id: 15,
    name: "Ivy Anderson",
    totalSpent: 0,
    isActive: true,
    dateOfBirth: "1990-11-05",
    createdAt: "2026-02-20T14:00",
  },
  {
    id: 16,
    name: "Tom Young",
    totalSpent: 0,
    isActive: false,
    dateOfBirth: "1997-03-22",
    createdAt: "2026-02-20T14:00",
  },
  {
    id: 17,
    name: "David Wilson",
    totalSpent: 0,
    isActive: true,
    dateOfBirth: "1986-09-14",
    createdAt: "2026-02-20T14:00",
  },
  {
    id: 18,
    name: "Pamela Clark",
    totalSpent: 200,
    isActive: true,
    dateOfBirth: "1992-12-27",
    createdAt: "2026-02-20T14:00",
  },
  {
    id: 19,
    name: "Karen Moore",
    totalSpent: 0,
    isActive: false,
    dateOfBirth: "1981-06-11",
    createdAt: "2026-02-20T14:00",
  },
  {
    id: 20,
    name: "Grace Lee",
    totalSpent: 0,
    isActive: true,
    dateOfBirth: "1994-08-03",
    createdAt: "2026-02-20T14:00",
  },
  {
    id: 21,
    name: "Wendy Wright",
    totalSpent: 0,
    isActive: true,
    dateOfBirth: null,
    createdAt: "2026-02-20T14:00",
  },
  {
    id: 22,
    name: "Mia Garcia",
    totalSpent: 0,
    isActive: false,
    dateOfBirth: "1998-04-16",
    createdAt: "2026-02-20T14:00",
  },
  {
    id: 23,
    name: "Ryan Walker",
    totalSpent: 0,
    isActive: true,
    dateOfBirth: "1984-10-09",
    createdAt: "2026-02-20T14:00",
  },
];

beforeEach(() => {
  useTableDataStore.setState({
    tableProperties,
    selectedRow: null,
    rows: rows,
    filters: {},
  });
});

describe("Table", () => {
  it("renders the table headers", () => {
    render(<Table />);
    expect(document.querySelectorAll("th")).toHaveLength(6);
    for (const property of tableProperties) {
      expect(screen.getByText(property.name)).toBeInTheDocument();
    }
  });

  it("displays 'No results found' when there are no rows", () => {
    useTableDataStore.setState({ rows: [] });
    useTablesStore.setState({ currentTable: "customers" });
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

  it("renders the correct cell values", () => {
    render(<Table />);
    expect(screen.getByText("Quinn Lewis")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("1990-01-15")).toBeInTheDocument();
    expect(screen.getAllByText("2026-02-17T11:05").length).toBeGreaterThan(0);
  });

  it("renders pagination controls when there are rows", () => {
    render(<Table />);
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.getByText("Previous")).toBeInTheDocument();
  });

  it("does not render pagination controls when there are no rows", () => {
    useTableDataStore.setState({ rows: [] });
    render(<Table />);
    expect(screen.queryByText("Page 1 of 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Next")).not.toBeInTheDocument();
    expect(screen.queryByText("Previous")).not.toBeInTheDocument();
  });

  it("disables pagination buttons when on the first page", () => {
    render(<Table />);
    expect(screen.getByText("Previous")).toBeDisabled();
  });

  it("disables pagination buttons when on the last page", async () => {
    render(<Table />);
    await userEvent.click(screen.getByText("Next"));
    await userEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Next")).toBeDisabled();
  });

  it("navigates to the next page when the Next button is clicked", async () => {
    render(<Table />);
    await userEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
    const current_rows = document.querySelectorAll("tbody tr");
    expect(current_rows[0]).toHaveTextContent("Frank Miller");
    expect(current_rows[1]).toHaveTextContent("Victor King");
    expect(current_rows[2]).toHaveTextContent("Oscar Hernandez");
  });

  it("navigates to the previous page when the Previous button is clicked", async () => {
    render(<Table />);
    await userEvent.click(screen.getByText("Next"));
    await userEvent.click(screen.getByText("Previous"));
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    const current_rows = document.querySelectorAll("tbody tr");
    expect(current_rows[0]).toHaveTextContent("Quinn Lewis");
    expect(current_rows[1]).toHaveTextContent("Eve Davis");
    expect(current_rows[2]).toHaveTextContent("Charlie Brown");
  });

  it("sorts the table when a header is clicked", async () => {
    render(<Table />);
    await userEvent.click(screen.getByText("name"));
    const current_rows = document.querySelectorAll("tbody tr");
    expect(current_rows[0]).toHaveTextContent("Wendy Wright");
    expect(current_rows[1]).toHaveTextContent("Victor King");
    expect(current_rows[2]).toHaveTextContent("Uma Allen");
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

  it("toggles sort direction when the same header is clicked twice", async () => {
    render(<Table />);
    await userEvent.click(screen.getByText("name"));
    await userEvent.click(screen.getByText("name ▼"));
    const current_rows = document.querySelectorAll("tbody tr");
    expect(current_rows[0]).toHaveTextContent("Alice Smith");
    expect(current_rows[1]).toHaveTextContent("Bob Johnson");
    expect(current_rows[2]).toHaveTextContent("Charlie Brown");
  });

  it("removes the sort when the same header is clicked three times", async () => {
    render(<Table />);
    await userEvent.click(screen.getByText("name"));
    expect(screen.getByText("name ▼")).toBeInTheDocument();
    await userEvent.click(screen.getByText("name ▼"));
    expect(screen.getByText("name ▲")).toBeInTheDocument();
    await userEvent.click(screen.getByText("name ▲"));
    expect(screen.getByText("name")).toBeInTheDocument();
    const current_rows = document.querySelectorAll("tbody tr");
    expect(current_rows[0]).toHaveTextContent("Quinn Lewis");
    expect(current_rows[1]).toHaveTextContent("Eve Davis");
    expect(current_rows[2]).toHaveTextContent("Charlie Brown");
  });

  it("it changes sort direction to ▼ when a different header is clicked", async () => {
    render(<Table />);
    await userEvent.click(screen.getByText("name"));
    expect(screen.getByText("name ▼")).toBeInTheDocument();
    await userEvent.click(screen.getByText("name ▼"));
    expect(screen.getByText("name ▲")).toBeInTheDocument();
    await userEvent.click(screen.getByText("totalSpent"));
    expect(screen.getByText("totalSpent ▼")).toBeInTheDocument();
  });

  it("resets to the first page when a header is clicked", async () => {
    render(<Table />);
    await userEvent.click(screen.getByText("Next"));
    await userEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Page 3 of 3")).toBeInTheDocument();
    await userEvent.click(screen.getByText("name"));
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
  });

  it("maintains the sort order when navigating pages", async () => {
    render(<Table />);
    await userEvent.click(screen.getByText("name"));
    await userEvent.click(screen.getByText("Next"));
    const current_rows = document.querySelectorAll("tbody tr");
    expect(current_rows[0]).toHaveTextContent("Mia Garcia");
    expect(current_rows[1]).toHaveTextContent("Leo Martin");
    expect(current_rows[2]).toHaveTextContent("Karen Moore");
  });

  it("maintains the sort order when opening a row", async () => {
    render(<Table />);
    await userEvent.click(screen.getByText("name"));
    await userEvent.click(screen.getByText("Next"));
    await userEvent.click(screen.getByText("Mia Garcia"));
    const current_rows = document.querySelectorAll("tbody tr");
    expect(current_rows[0]).toHaveTextContent("Mia Garcia");
    expect(current_rows[1]).toHaveTextContent("Leo Martin");
    expect(current_rows[2]).toHaveTextContent("Karen Moore");
  });

  it("resets to the first page when filters are applied", async () => {
    render(<Table />);
    await userEvent.click(screen.getByText("Next"));
    await userEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Page 3 of 3")).toBeInTheDocument();
    act(() => useTableDataStore.setState({ filters: { name: "Alice" } }));
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
  });

  it("resets to the first page when filters are cleared", async () => {
    render(<Table />);
    await userEvent.click(screen.getByText("Next"));
    await userEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Page 3 of 3")).toBeInTheDocument();
    act(() => useTableDataStore.setState({ filters: { name: "Alice" } }));
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    act(() => useTableDataStore.setState({ filters: { name: "" } }));
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
  });
});
