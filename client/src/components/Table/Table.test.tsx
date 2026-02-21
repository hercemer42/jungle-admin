import { beforeEach, describe, expect, it } from "vitest";
import { useTableDataStore } from "../../store/useTableDataStore";
import { act, render, screen } from "@testing-library/react";
import { Table } from "./Table";
import userEvent from "@testing-library/user-event";

const tableProperties = ["id", "name", "totalSpent"];

const rows = [
  { id: "1", name: "Quinn Lewis", totalSpent: "25" },
  { id: "2", name: "Eve Davis", totalSpent: "500" },
  { id: "3", name: "Charlie Brown", totalSpent: "0" },
  { id: "4", name: "Uma Allen", totalSpent: "100" },
  { id: "5", name: "Alice Smith", totalSpent: "50" },
  { id: "6", name: "Hank Taylor", totalSpent: "0" },
  { id: "7", name: "Nina Rodriguez", totalSpent: "10" },
  { id: "8", name: "Leo Martin", totalSpent: "5" },
  { id: "9", name: "Sara Hall", totalSpent: "2" },
  { id: "10", name: "Jack Thomas", totalSpent: "4" },
  { id: "11", name: "Frank Miller", totalSpent: "0" },
  { id: "12", name: "Victor King", totalSpent: "0" },
  { id: "13", name: "Oscar Hernandez", totalSpent: "0" },
  { id: "14", name: "Bob Johnson", totalSpent: "300" },
  { id: "15", name: "Ivy Anderson", totalSpent: "0" },
  { id: "16", name: "Tom Young", totalSpent: "0" },
  { id: "17", name: "David Wilson", totalSpent: "0" },
  { id: "18", name: "Pamela Clark", totalSpent: "200" },
  { id: "19", name: "Karen Moore", totalSpent: "0" },
  { id: "20", name: "Grace Lee", totalSpent: "0" },
  { id: "21", name: "Wendy Wright", totalSpent: "0" },
  { id: "22", name: "Mia Garcia", totalSpent: "0" },
  { id: "23", name: "Ryan Walker", totalSpent: "0" },
];

beforeEach(() => {
  useTableDataStore.setState({
    tableProperties: ["id", "name", "totalSpent"],
    selectedRow: null,
    rows: rows,
    filters: {},
  });
});

describe("Table", () => {
  it("renders the table headers", () => {
    render(<Table />);
    expect(document.querySelectorAll("th")).toHaveLength(3);
    for (const property of tableProperties) {
      expect(screen.getByText(property)).toBeInTheDocument();
    }
  });

  it("displays 'No results found' when there are no rows", () => {
    useTableDataStore.setState({ rows: [] });
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
      expect(row.querySelectorAll("td")).toHaveLength(3);
    }
  });

  it("renders the correct cell values", () => {
    render(<Table />);
    expect(screen.getByText("Quinn Lewis")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
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
      id: "1",
      name: "Quinn Lewis",
      totalSpent: "25",
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
