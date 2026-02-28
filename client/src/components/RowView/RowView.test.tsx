import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useTableDataStore } from "../../store/useTableDataStore";
import { RowView } from "./RowView";
import type { Row, Field } from "../../types/types";

const fakeRow: Row = {
  id: 1,
  name: "Alice Smith",
  totalSpent: 500,
  isActive: true,
  dateOfBirth: "1990-01-15",
  createdAt: "2026-02-17T11:05",
};

const tableProperties: Field[] = [
  { name: "id", type: "number", editable: false },
  { name: "name", type: "text", editable: true },
  { name: "totalSpent", type: "number", editable: true },
  { name: "isActive", type: "checkbox", editable: true },
  { name: "dateOfBirth", type: "date", editable: true },
  { name: "createdAt", type: "datetime-local", editable: false },
];

beforeEach(() => {
  useTableDataStore.setState({
    selectedRow: fakeRow,
    tableProperties,
    editing: false,
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
    expect(screen.getByText("Yes")).toBeInTheDocument();
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
    expect(numberInputs).toHaveLength(1);
    expect(checkboxInputs).toHaveLength(1);
    expect(textInputs[0]).toHaveValue("Alice Smith");
    expect(numberInputs[0]).toHaveValue(500);
    expect(checkboxInputs[0]).toBeChecked();
    expect(screen.getByDisplayValue("1990-01-15")).toHaveAttribute(
      "type",
      "date",
    );
    expect(screen.getByText("1")).toBeInTheDocument();
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

  it("shows Save button when editing", async () => {
    render(<RowView />);

    await userEvent.click(screen.getByText("Edit"));

    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  it("calls updateRow and exits editing on Save", async () => {
    const updateRowSpy = vi.fn().mockImplementation(async () => {
      useTableDataStore.setState({ editing: false });
    });
    useTableDataStore.setState({ updateRow: updateRowSpy });
    render(<RowView />);

    await userEvent.click(screen.getByText("Edit"));
    const nameInput = screen.getByRole("textbox");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Bob Jones");
    await userEvent.click(screen.getByText("Save"));

    expect(updateRowSpy).toHaveBeenCalledOnce();
    expect(updateRowSpy).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Bob Jones" }),
    );
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("passes checkbox values correctly on Save", async () => {
    const updateRowSpy = vi.fn().mockResolvedValue(undefined);
    useTableDataStore.setState({ updateRow: updateRowSpy });
    render(<RowView />);

    await userEvent.click(screen.getByText("Edit"));
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByText("Save"));

    expect(updateRowSpy).toHaveBeenCalledWith(
      expect.objectContaining({ isActive: false }),
    );
  });

  it("stays in edit mode on save failure", async () => {
    const updateRowSpy = vi.fn().mockResolvedValue(undefined);
    useTableDataStore.setState({ updateRow: updateRowSpy });
    render(<RowView />);

    await userEvent.click(screen.getByText("Edit"));
    await userEvent.click(screen.getByText("Save"));

    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("calls closeRowView when the modal backdrop is clicked", async () => {
    render(<RowView />);

    await userEvent.click(screen.getByText("X"));

    expect(useTableDataStore.getState().selectedRow).toBeNull();
  });

  it("resets editing state when closing the modal", async () => {
    useTableDataStore.setState({ editing: true });
    render(<RowView />);

    await userEvent.click(screen.getByText("X"));

    expect(useTableDataStore.getState().editing).toBe(false);
  });
});
