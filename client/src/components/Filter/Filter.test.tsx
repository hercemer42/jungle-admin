import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTableDataStore } from "../../../store/useTableDataStore";
import { render, screen } from "@testing-library/react";
import { Filter } from "./Filter";
import userEvent from "@testing-library/user-event";
import type { Field } from "../../../types/types";

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
    expect(screen.getAllByText("id")).toHaveLength(2);
    expect(screen.getAllByText("name")).toHaveLength(2);
    expect(screen.getAllByText("totalSpent")).toHaveLength(2);
  });

  it("does not add duplicate columnFilters", async () => {
    render(<Filter />);
    await userEvent.selectOptions(screen.getByRole("combobox"), "name");
    await userEvent.selectOptions(screen.getByRole("combobox"), "name");

    expect(screen.getAllByRole("textbox")).toHaveLength(1);
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
