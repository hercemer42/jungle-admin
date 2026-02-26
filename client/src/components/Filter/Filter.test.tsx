import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTableDataStore } from "../../store/useTableDataStore";
import { render, screen } from "@testing-library/react";
import { Filter } from "./Filter";
import userEvent from "@testing-library/user-event";
import type { Field } from "../../types/types";

const tableProperties: Field[] = [
  { name: "id", type: "number", editable: false },
  { name: "name", type: "text", editable: true },
  { name: "totalSpent", type: "number", editable: true },
];

beforeEach(() => {
  useTableDataStore.setState({
    columnFilters: {},
    tableProperties,
  });
});

describe("Filter", () => {
  it("has no default filter set", () => {
    render(<Filter />);
    expect(screen.getByRole("combobox")).toHaveValue("");
  });

  it("adds columnFilters when selected", async () => {
    render(<Filter />);
    for (const tableProperty of tableProperties) {
      await userEvent.selectOptions(
        screen.getByRole("combobox"),
        tableProperty.name,
      );
    }

    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toEqual(3);
    expect(screen.getAllByText("ID")).toHaveLength(2); // select + filter label
    expect(screen.getAllByText("Name")).toHaveLength(2);
    expect(screen.getAllByText("Total Spent")).toHaveLength(2);
  });

  it("does not add duplicate columnFilters", async () => {
    render(<Filter />);
    await userEvent.selectOptions(screen.getByRole("combobox"), "name");
    await userEvent.selectOptions(screen.getByRole("combobox"), "name");

    expect(screen.getAllByRole("textbox")).toHaveLength(1);
  });

  it("resets the select to empty after adding a filter", async () => {
    render(<Filter />);
    await userEvent.selectOptions(screen.getByRole("combobox"), "name");

    expect(screen.getByRole("combobox")).toHaveValue("");
  });

  it("removes a filter when the remove button is clicked", async () => {
    render(<Filter />);
    await userEvent.selectOptions(screen.getByRole("combobox"), "name");
    await userEvent.selectOptions(screen.getByRole("combobox"), "totalSpent");

    expect(screen.getAllByRole("textbox")).toHaveLength(2);

    const removeButtons = screen.getAllByText("✕");
    await userEvent.click(removeButtons[0]);

    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.getAllByText("Name")).toHaveLength(1);
    expect(screen.getAllByText("Total Spent")).toHaveLength(2);
  });

  it("removes the filter from the store when remove is clicked", async () => {
    render(<Filter />);
    await userEvent.selectOptions(screen.getByRole("combobox"), "name");

    await userEvent.click(screen.getByText("✕"));

    const state = useTableDataStore.getState();
    expect(state.columnFilters).toEqual({});
  });

  it("updates the columnFilters when text is input", async () => {
    render(<Filter />);
    for (const tableProperty of tableProperties) {
      await userEvent.selectOptions(
        screen.getByRole("combobox"),
        tableProperty.name,
      );
    }

    const inputs = screen.getAllByRole("textbox");

    for (const [index, input] of inputs.entries()) {
      await userEvent.type(input, `text ${index}`);
      expect(input).toHaveValue(`text ${index}`);
    }

    await vi.waitFor(() => {
      const columnFilters = useTableDataStore.getState().columnFilters;
      for (const [index, tableProperty] of tableProperties.entries()) {
        expect(columnFilters[tableProperty.name]).toEqual(`text ${index}`);
      }
    });
  });
});
