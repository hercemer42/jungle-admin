import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import {
  useTableDataStore,
  type Field,
  type Row,
} from "../../store/useTableDataStore";
import { RowView } from "./RowView";

const fakeRow: Row = {
  id: 1,
  name: "Alice Smith",
  totalSpent: 500,
  isActive: true,
  dateOfBirth: "1990-01-15",
  createdAt: "2026-02-17T11:05",
};

const tableProperties: Field[] = [
  { name: "id", type: "number" },
  { name: "name", type: "text" },
  { name: "totalSpent", type: "number" },
  { name: "isActive", type: "checkbox" },
  { name: "dateOfBirth", type: "date" },
  { name: "createdAt", type: "datetime-local" },
];

beforeEach(() => {
  useTableDataStore.setState({
    selectedRow: fakeRow,
    tableProperties,
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
    expect(screen.getByText("true")).toBeInTheDocument();
    expect(screen.getByText("1990-01-15")).toBeInTheDocument();
    expect(screen.getByText("2026-02-17T11:05")).toBeInTheDocument();
  });

  it("shows values as text by default", () => {
    render(<RowView />);

    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    expect(screen.queryAllByRole("spinbutton")).toHaveLength(0);
    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("switches to input fields when Edit is clicked", async () => {
    render(<RowView />);

    await userEvent.click(screen.getByText("Edit"));

    const textInputs = screen.getAllByRole("textbox");
    const numberInputs = screen.getAllByRole("spinbutton");
    const checkboxInputs = screen.getAllByRole("checkbox");
    expect(textInputs).toHaveLength(1);
    expect(numberInputs).toHaveLength(2);
    expect(checkboxInputs).toHaveLength(1);
    expect(numberInputs[0]).toHaveValue(1);
    expect(textInputs[0]).toHaveValue("Alice Smith");
    expect(numberInputs[1]).toHaveValue(500);
    expect(checkboxInputs[0]).toBeChecked();
    expect(screen.getByDisplayValue("1990-01-15")).toHaveAttribute("type", "date");
    expect(screen.getByDisplayValue("2026-02-17T11:05")).toHaveAttribute("type", "datetime-local");
  });

  it("switches back to text display when Cancel is clicked", async () => {
    render(<RowView />);

    await userEvent.click(screen.getByText("Edit"));
    await userEvent.click(screen.getByText("Cancel"));

    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    expect(screen.queryAllByRole("spinbutton")).toHaveLength(0);
    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("calls closeRowView when the modal backdrop is clicked", async () => {
    render(<RowView />);

    await userEvent.click(screen.getByText("X"));

    expect(useTableDataStore.getState().selectedRow).toBeNull();
  });
});
