import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { useTableDataStore, type Row } from "../../store/useTableDataStore";
import { RowView } from "./RowView";

const fakeRow: Row = {
  id: "1",
  name: "Alice Smith",
  totalSpent: "500",
};

const tableProperties = ["id", "name", "totalSpent"];

beforeEach(() => {
  useTableDataStore.setState({
    selectedRow: fakeRow,
    tableProperties: [...tableProperties] as (keyof Row)[],
  });
});

describe("RowView", () => {
  it("renders nothing when no row is selected", () => {
    useTableDataStore.setState({ selectedRow: null });
    const { container } = render(<RowView />);
    expect(container.innerHTML).toBe("");
  });

  it("displays row properties when a row is selected", () => {
    render(<RowView />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
  });

  it("shows values as text by default", () => {
    render(<RowView />);

    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("switches to input fields when Edit is clicked", async () => {
    render(<RowView />);

    await userEvent.click(screen.getByText("Edit"));

    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(tableProperties.length);
    expect(inputs[0]).toHaveValue("1");
    expect(inputs[1]).toHaveValue("Alice Smith");
    expect(inputs[2]).toHaveValue("500");
  });

  it("switches back to text display when Cancel is clicked", async () => {
    render(<RowView />);

    await userEvent.click(screen.getByText("Edit"));
    await userEvent.click(screen.getByText("Cancel"));

    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("calls closeRowView when the modal backdrop is clicked", async () => {
    render(<RowView />);

    await userEvent.click(screen.getByText("X"));

    expect(useTableDataStore.getState().selectedRow).toBeNull();
  });
});
